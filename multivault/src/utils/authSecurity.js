import { auth, db } from '../firebase/firebase';
import { collection, doc, getDoc, setDoc, updateDoc,query, where, getDocs } from 'firebase/firestore';
import { sendPasswordResetEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { loggingService } from './LoggingService';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "In what city were you born?",
  "What was your first car?",
  "What elementary school did you attend?",
  "What is your mother's maiden name?"
];

export const PASSWORD_CHANGE_COOLDOWN = 24 * 60 * 60 * 1000;

export const securityService = {

  async initiatePasswordReset(email) {
    try {
      const userQuery = await getDocs(
        query(collection(db, 'users'), where('email', '==', email))
      );
      
      if (userQuery.empty) {

        return { success: true, message: 'If an account exists, reset instructions have been sent' };
      }

      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();

      if (!userData.securityQuestions) {

        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent' };
      }


      const resetToken = Math.random().toString(36).substr(2, 10);
      await setDoc(doc(db, 'passwordResets', userDoc.id), {
        token: resetToken,
        expires: new Date(Date.now() + 3600000).toISOString(),
        attempts: 0
      });

      await sendPasswordResetEmail(auth, email);
      
      await loggingService.logEvent(
        'password_reset_initiated',
        { email },
        userDoc.id,
        'info'
      );

      return { success: true, message: 'Password reset initiated' };
    } catch (error) {
      await loggingService.logEvent(
        'password_reset_error',
        { email, error: error.message },
        null,
        'error'
      );
      throw error;
    }
  },


  async verifySecurityQuestions(email, answers) {
    const userQuery = await getDocs(
      query(collection(db, 'users'), where('email', '==', email))
    );
    
    if (userQuery.empty) {
      return false;
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const storedAnswers = userData.securityQuestions;

    // Compare answers (case insensitive)
    for (const [question, answer] of Object.entries(answers)) {
      if (!storedAnswers[question] || 
          storedAnswers[question].toLowerCase() !== answer.toLowerCase()) {
        return false;
      }
    }

    return true;
  },


  async setupSecurityQuestions(userId, questionAnswers) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        securityQuestions: questionAnswers
      });

      await loggingService.logEvent(
        'security_questions_setup',
        { userId },
        userId,
        'info'
      );

      return true;
    } catch (error) {
      await loggingService.logEvent(
        'security_questions_setup_error',
        { userId, error: error.message },
        userId,
        'error'
      );
      throw error;
    }
  },


  async canChangePassword(userId) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (!userData.lastPasswordChange) {
      return true;
    }

    const lastChange = new Date(userData.lastPasswordChange).getTime();
    const now = Date.now();
    return (now - lastChange) >= PASSWORD_CHANGE_COOLDOWN;
  },


  async reauthorizeUser(currentPassword) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      await loggingService.logEvent(
        'reauthorization_failure',
        { userId: user.uid, error: error.message },
        user.uid,
        'warning'
      );
      return false;
    }
  },


  async changePassword(userId, currentPassword, newPassword) {
    try {

      if (!await this.canChangePassword(userId)) {
        throw new Error('Password was changed too recently. Please wait 24 hours between password changes.');
      }


      const reauthSuccess = await this.reauthorizeUser(currentPassword);
      if (!reauthSuccess) {
        throw new Error('Current password is incorrect');
      }


      const historyRef = doc(db, `users/${userId}/security/passwordHistory`);
      const historyDoc = await getDoc(historyRef);
      const passwordHistory = historyDoc.data()?.passwords || [];


      if (passwordHistory.includes(newPassword)) {
        throw new Error('New password cannot be the same as any of your previous passwords');
      }


      const user = auth.currentUser;
      await updatePassword(user, newPassword);


      await setDoc(historyRef, {
        passwords: [...passwordHistory, newPassword].slice(-5), 
        lastChanged: new Date().toISOString()
      });


      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastPasswordChange: new Date().toISOString()
      });

      await loggingService.logEvent(
        'password_change_success',
        { userId },
        userId,
        'info'
      );

      return { success: true };
    } catch (error) {
      await loggingService.logEvent(
        'password_change_error',
        { userId, error: error.message },
        userId,
        'error'
      );
      throw error;
    }
  }
};
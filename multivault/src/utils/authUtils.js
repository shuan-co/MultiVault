import { auth, db } from '../firebase/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000;

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    errors.push(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const trackLoginAttempt = async (email) => {
  const loginAttemptsRef = doc(db, 'loginAttempts', email);
  const now = new Date();

  try {
    const docSnap = await getDoc(loginAttemptsRef);
    let attempts = {
      count: 1,
      lastAttempt: now.toISOString(),
      lockedUntil: null
    };

    if (docSnap.exists()) {
      attempts = docSnap.data();
      
      if (attempts.lockedUntil && new Date(attempts.lockedUntil) < now) {
        attempts.count = 1;
        attempts.lockedUntil = null;
      } else {
        attempts.count += 1;
        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
          attempts.lockedUntil = new Date(now.getTime() + LOCKOUT_DURATION).toISOString();
        }
      }
    }

    await setDoc(loginAttemptsRef, attempts);
    return attempts;
  } catch (error) {
    console.error('Error tracking login attempt:', error);
    throw error;
  }
};

export const isAccountLocked = async (email) => {
  const loginAttemptsRef = doc(db, 'loginAttempts', email);
  
  try {
    const docSnap = await getDoc(loginAttemptsRef);
    if (!docSnap.exists()) {
      return false;
    }

    const attempts = docSnap.data();
    if (attempts.lockedUntil) {
      const lockExpiry = new Date(attempts.lockedUntil);
      if (lockExpiry > new Date()) {
        const minutesLeft = Math.ceil((lockExpiry - new Date()) / (60 * 1000));
        return {
          locked: true,
          minutesLeft
        };
      }
    }
    return { locked: false };
  } catch (error) {
    console.error('Error checking account lock status:', error);
    throw error;
  }
};
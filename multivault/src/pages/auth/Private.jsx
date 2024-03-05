import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { signOut, deleteUser } from 'firebase/auth';  // Import 'deleteUser' from 'firebase/auth'
import { doc, getDoc, deleteDoc } from 'firebase/firestore';  // Import 'deleteDoc'

export const Private = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = getDoc(userRef);

      docSnap.then((doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        } else {
          console.error('User data not found');
        }
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Logged out Successfully");
    }).catch((err) => {
      alert('Log out error');
      console.error(err);
    });
  }

  const handleDeleteAccount = () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);

      // Delete user data from Firestore
      deleteDoc(userRef).then(() => {
        // Delete user account
        deleteUser(user).then(() => {
          alert("Account deleted successfully");
        }).catch((error) => {
          alert('Error deleting account');
          console.error(error);
        });
      }).catch((error) => {
        alert('Error deleting user data');
        console.error(error);
      });
    }
  }

  return (
    <div>
      <h1>Private Route</h1>
      {userData && (
        <div>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Sex: {userData.sex}</p>
          <p>Birthday: {userData.birthday}</p>
          <p>Company Name: {userData.companyName}</p>
          <p>Business Type: {userData.businessType}</p>
          <p>Business Description: {userData.businessDesc}</p>
          <p>Account Type: {userData.accountType}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout Button</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
}

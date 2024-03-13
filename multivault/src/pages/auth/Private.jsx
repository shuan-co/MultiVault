import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { signOut, updateProfile, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const Private = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = getDoc(userRef);

      docSnap.then((doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
          setUpdatedUserData(doc.data());
        } else {
          console.error('User data not found');
        }
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, []);

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

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Logged out Successfully");
    }).catch((err) => {
      alert('Log out error');
      console.error(err);
    });
  }

  const handleEdit = () => {
    setEditing(true);
  }

  const handleSave = () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);

      updateDoc(userRef, updatedUserData).then(() => {
        setUserData(updatedUserData);
        setEditing(false);
        alert("Profile updated successfully");
      }).catch((error) => {
        alert('Error updating profile');
        console.error(error);
      });

      updateProfile(user, {
        displayName: updatedUserData.firstName + ' ' + updatedUserData.lastName
      }).catch((error) => {
        console.error('Error updating display name:', error);
      });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  return (
    <div>
      <h1>Profile</h1>
      {userData && (
        <div>
          {editing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={updatedUserData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                value={updatedUserData.lastName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="sex"
                value={updatedUserData.sex}
                onChange={handleChange}
              />
              <input
                type="text"
                name="birthday"
                value={updatedUserData.birthday}
                onChange={handleChange}
              />
              <input
                type="text"
                name="companyName"
                value={updatedUserData.companyName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="businessType"
                value={updatedUserData.businessType}
                onChange={handleChange}
              />
              <textarea
                name="businessDesc"
                value={updatedUserData.businessDesc}
                onChange={handleChange}
              ></textarea>
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <p>First Name: {userData.firstName}</p>
              <p>Last Name: {userData.lastName}</p>
              <p>Sex: {userData.sex}</p>
              <p>Birthday: {userData.birthday}</p>
              <p>Company Name: {userData.companyName}</p>
              <p>Business Type: {userData.businessType}</p>
              <p>Business Description: {userData.businessDesc}</p>
              <p>Account Type: {userData.accountType}</p>
              <button onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
}
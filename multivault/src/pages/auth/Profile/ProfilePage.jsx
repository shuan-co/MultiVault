// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || '');
        setEmail(user.email || '');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName });
      alert('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      {error && <p>{error}</p>}
      {user && (
        <form onSubmit={handleUpdateProfile}>
          <label>
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input type="email" value={email} readOnly />
          </label>
          <button type="submit" disabled={loading}>
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
import React from 'react';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';

export const Private = () => {

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Logged out Successfully");
    }).catch((err) => {
      alert('Log out error');
      console.error(err);
    });

  }

  return (
    <div>
      <h1>Private Route</h1>
      <button onClick={handleLogout}>Logout Button</button>
    </div>

  )
}

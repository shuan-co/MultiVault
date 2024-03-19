import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom'


export default function Navbar() {
    const navigate = useNavigate()

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
        <div style={{backgroundColor: '#396079'}} className='p-5 px-12 text-white flex justify-between items-center'>
            <h1 className='text-3xl'>Multivault</h1>
            <div className='space-x-16'>
                <button className='text-xl text-white' onClick={() => navigate('/landing')}>Home</button>
                <button className='text-xl text-white' onClick={() => handleLogout()}>Logout</button>
            </div>
        </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react';
import loginBg from './loginBg.jpg';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { isAccountLocked, trackLoginAttempt } from '../../../utils/authUtils';
import { ROLES } from '../roles';
import { LoggingService } from '../../../utils/LoggingService';
import { securityService } from '../../../utils/authSecurity';

const loggingService = new LoggingService();

export const handleRedirect = async (user, navigate) => {
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            navigate('/unauthorized');
            return;
        }

        const userRole = userDoc.data().role;
        
        switch (userRole) {
            case ROLES.ADMIN:
                navigate('/admin-dashboard');
                break;
            case ROLES.BUSINESS_OWNER:
            case ROLES.STAFF:
            case ROLES.CUSTOMER:
                navigate('/inventory');
                break;
            default:
                navigate('/unauthorized');
                break;
        }
    } catch (error) {
        console.error("Error determining user role:", error);
        navigate('/login');
    }
};

export default function Login() {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('User');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/inventory');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGeneralError('');
      
        try {

          const emailInput = document.getElementById('email-input').value;
          const passwordInput = document.getElementById('password-input').value;
      
          const lockRef = doc(db, 'loginAttempts', emailInput);
          const lockDoc = await getDoc(lockRef);
          
          if (lockDoc.exists()) {
            const lockData = lockDoc.data();
            if (lockData.lockedUntil && new Date(lockData.lockedUntil) > new Date()) {
              const minutesLeft = Math.ceil((new Date(lockData.lockedUntil) - new Date()) / (60 * 1000));
              setGeneralError(`Account is temporarily locked. Please try again in ${minutesLeft} minutes.`);
              setLoading(false);
              return;
            }
          }
      
          const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
          const user = userCredential.user;
      
          await setDoc(lockRef, {
            count: 0,
            lastAttempt: new Date().toISOString(),
            lockedUntil: null
          });
      
          await loggingService.logEvent(
            'login_success',
            {
              userId: user.uid,
              email: emailInput
            },
            user.uid,
            'info'
          );
      
          const userActivityRef = doc(db, 'users', user.uid, 'activity', 'login');
          await setDoc(userActivityRef, {
            timestamp: new Date().toISOString(),
            success: true
          });
      
          alert('Login Successful');
          await handleRedirect(user, navigate);
      
        } catch (error) {
          console.error('Login error:', error);
          
          const lockRef = doc(db, 'loginAttempts', email);
          const lockDoc = await getDoc(lockRef);
          
          let attempts = lockDoc.exists() ? lockDoc.data() : { count: 0 };
          attempts.count = (attempts.count || 0) + 1;
          attempts.lastAttempt = new Date().toISOString();
          
          if (attempts.count >= 5) {
            attempts.lockedUntil = new Date(Date.now() + (30 * 60 * 1000)).toISOString(); // 30 minutes
          }
          
          await setDoc(lockRef, attempts);
      
          await loggingService.logEvent(
            'login_failure',
            {
              email,
              error: error.message
            },
            null,
            'warning'
          );
      
          setGeneralError('Invalid credentials. Please try again.');
          setPassword('');
        } finally {
          setLoading(false);
        }
      };


    const resetPassword = async (email) => {
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            await LoggingService.logEvent(
                'password_reset_request',
                { email },
                null,
                'info'
            );
            alert('Password reset email sent!');
        } catch (error) {
            await LoggingService.logEvent(
                'password_reset_failed',
                { email, error: error.message },
                null,
                'warning'
            );
            setGeneralError('Error sending password reset email. Please try again.');
            console.error(error);
        }
    };

    const handleForgotPasswordSubmit = () => {
        setShowModal(false);
        resetPassword(email);
    }

    const checkAccountLockout = async (email) => {
        const attemptsRef = doc(db, 'loginAttempts', email);
        const attemptsDoc = await getDoc(attemptsRef);
        
        if (attemptsDoc.exists()) {
            const data = attemptsDoc.data();
            if (data.lockedUntil && new Date(data.lockedUntil) > new Date()) {
                const minutesLeft = Math.ceil((new Date(data.lockedUntil) - new Date()) / (60 * 1000));
                return { locked: true, minutesLeft };
            }
        }
        return { locked: false };
    };

    const updateLoginAttempts = async (email, success) => {
        const attemptsRef = doc(db, 'loginAttempts', email);
        const now = new Date();
        
        const attemptsDoc = await getDoc(attemptsRef);
        let attempts = attemptsDoc.exists() ? attemptsDoc.data() : { count: 0 };

        if (success) {
            attempts = { count: 0, lastAttempt: now.toISOString() };
        } else {
            attempts.count = (attempts.count || 0) + 1;
            if (attempts.count >= 5) { // Lock after 5 failed attempts
                attempts.lockedUntil = new Date(now.getTime() + (30 * 60 * 1000)).toISOString(); // 30 minute lockout
            }
        }
        
        await setDoc(attemptsRef, attempts);
    };

    const updateLastLogin = async (userId) => {
        const userActivityRef = doc(db, 'users', userId, 'activity', 'login');
        const lastLogin = {
            timestamp: new Date().toISOString(),
            success: true
        };
        await setDoc(userActivityRef, lastLogin);
    };

    return (
        <div style={{ backgroundImage: `url(${loginBg})` }} className='flex items-center justify-center h-screen'>
            <div>
                {showModal ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                        <h3 className="text-3xl font-semibold text-black">Reset Password</h3>
                                        <button className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}>
                                            <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex-auto">
                                        <input type="email" 
                                               className="rounded-lg bg-slate-200 w-96 p-2" 
                                               onChange={(e) => setEmail(e.target.value)}
                                               placeholder="Enter your email"/>
                                    </div>
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                            onClick={() => setShowModal(false)}>
                                            Close
                                        </button>
                                        <button className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                            onClick={handleForgotPasswordSubmit}>
                                            Send Reset Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </div>
            <div className='w-screen'>
                <h1 className='text-center text-white text-8xl inter font-extrabold mb-5'>MultiVault</h1>
                <div className='w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3 h-96 mx-auto bg-slate-200 rounded-xl p-5 border'>
                    <div className='mb-6 text-center'>
                        <h2 className='font-bold text-2xl'>Welcome!</h2>
                        <div className='text-white mt-3 w-full'>
                            <button className={`w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 p-1 rounded-l-lg ${activeButton === 'User' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'}`}
                                onClick={() => handleButtonClick('User')}>
                                User
                            </button>
                            <button className={`w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 p-1 rounded-r-lg ${activeButton === 'Business' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-zinc-400' : 'hover:bg-amber-400'}`}
                                onClick={() => handleButtonClick('Business')}>
                                Business
                            </button>
                        </div>
                    </div>
                    {generalError && (
                        <div className="text-red-500 text-center mb-4">
                            {generalError}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className='mx-auto p-2 space-y-3'>
                            <div>
                                <h3>Email</h3>
                                <input type='email' 
                                       id='email-input' 
                                       placeholder='Enter your email' 
                                       className='rounded-md p-2 w-full italic ps-3' 
                                       data-testid="email"
                                       onChange={(e) => setEmail(e.target.value)}
                                       required />
                            </div>
                            <div>
                                <h3>Password</h3>
                                <input type='password' 
                                       id='password-input' 
                                       placeholder='Enter your password' 
                                       className='rounded-md p-2 w-full italic ps-3' 
                                       data-testid="password"
                                       onChange={(e) => setPassword(e.target.value)}
                                       required />
                            </div>
                        </div>
                        <div className='mt-3 border w-full mx-auto border'>
                            <button type='submit' 
                                    className='text-white bg-amber-500 rounded-md p-2 hover:bg-amber-400 mx-auto w-3/4 block'
                                    disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                            <div className='text-center space-x-4 text-slate-400 border w-full'>
                                <button type="button" className='text-xs hover:underline underline-offset-4' onClick={() => setShowModal(true)}>
                                    Forgot password
                                </button>
                                <button type="button" onClick={() => navigate('/register')} className='text-xs hover:underline underline-offset-4'>
                                    Create an account
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='mx-auto text-center mt-5'>
                    <button className='text-slate-100 hover:underline underline-offset-2' onClick={() => navigate('/landing')}>
                        Back Home?
                    </button>
                </div>
            </div>
        </div>
    );
}
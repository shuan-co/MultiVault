// Login.jsx where authentication is done through Firebase Authetication
import React, { useState, useEffect } from 'react'
import loginBg from './loginBg.jpg'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../../firebase/firebase';

export default function Login() {
	const navigate = useNavigate();
	const [activeButton, setActiveButton] = useState('User');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('')

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
		  if (user) {
			// User is already logged in, redirect to inventory
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

		try {
			var emailInput = document.getElementById('email-input').value;
			var passwordInput = document.getElementById('password-input').value;

			const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
			const user = userCredential.user;
			const userToken = await user.getIdToken();
			alert('Login Successful')
			handleRedirect(user.accountType);
		} catch (error) {
			setError('Invalid email or password');
			alert('Invalid Credentials')
			setPassword('');	// clear password field
		}
	}

    const handleRedirect = ( accountType ) => {
		switch( accountType ) {
        /*
            case 'restaurantManager':
            case 'stockManager':
                navigate('/inventory');
                break;
            case 'financeManager':
                navigate('/dashboard');
                break;
            case 'kitchenStaff':
                navigate('/expiration'); // Not sure where to redirect staff members
                break;
        */
            default: 
                navigate('/inventory');
                break;
        }
    }

    const resetPassword = (email) => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent!')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " " + errorMessage)
        });
    }

    const handleForgotPasswordSubmit = () => {
        setShowModal(false)
        resetPassword(email)
    }

	return (
		<div style={{ backgroundImage: `url(${loginBg})` }} className='flex items-center justify-center h-screen'>
            <div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold text-black">
                                        Reset Password
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"> × </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto text-black space-y-3">
                                    <h1 className="text-xl">Enter your email:</h1>
                                    <input type="email" className="rounded-lg bg-slate-200 w-96 p-2" onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white active:bg-yellow-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleForgotPasswordSubmit()}
                                    >
                                        Save Changes
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
							<button className={`w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 p-1 rounded-l-lg ${activeButton === 'User' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'} `}
								onClick={() => handleButtonClick('User')}
							>
								User
							</button>
							<button className={`w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 p-1 rounded-r-lg ${activeButton === 'Business' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-zinc-400' : 'hover:bg-amber-400'}`}
								onClick={() => handleButtonClick('Business')}
							>
								Business
							</button>
						</div>
					</div>
					<form onSubmit={handleLogin}>
						<div className='mx-auto p-2 space-y-3'>
							<div>
								<h3>Email</h3>
								<input type='email' id='email-input' placeholder='Enter your email' className='rounded-md p-2 w-full italic ps-3' data-testid="email"/>
							</div>
							<div>
								<h3>Password</h3>
								<input type='password' id='password-input' placeholder='Enter your password' className='rounded-md p-2 w-full italic ps-3' data-testid="password"/>
							</div>
						</div>
						<div className='mt-3 border w-full mx-auto border'>
							<button type='submit' 
                                    className='text-white bg-amber-500 rounded-md p-2 hover:bg-amber-400
                                               mx-auto w-3/4 block'>Sign in</button>
							<div className='text-center space-x-4 text-slate-400 border w-full'>
								<a className='text-xs hover:underline underline-offset-4' onClick={() => setShowModal(true)}>Forgot password</a>
								<a onClick={() => navigate('/register')} className='text-xs hover:underline underline-offset-4'>Create an account</a>
							</div>
						</div>
					</form>
				</div>
                <div className='mx-auto text-center mt-5'>
                    <button className='text-slate-100 hover:underline underline-offset-2' onClick={() => navigate('/landing')}>Back Home?</button>
                </div>
			</div>
		</div>
	)
}
// Login.jsx where authentication is done through Firebase Authetication

import React, { useState } from 'react'
import loginBg from './loginBg.jpg'
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence } from 'firebase/auth';
import { auth } from 'firebase/firebase';

export default function Login() {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('User');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

    const handleButtonClick = (button) => {
      	setActiveButton(button);
    };

	const handleLogin = async(e) => {
		e.preventDefault();
		try {
			await setPersistence( auth, 'session' );

			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			const userToken = await user.getIdToken();
			handleRedirect( user.accountType );
			
		} catch( error ) {
			setError( 'Invalid email or password' );
			setPassword( '' );	// clear password field
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
                navigate('/homepage');
                break;
        }
    }

  	return (
	<div style = {{ backgroundImage:`url(${loginBg})` }} className = 'flex items-center justify-center h-screen'>
		<div className='w-screen space-y-10'>
			<h1 className='text-center text-white text-8xl inter font-extrabold'>MultiVault</h1>
			<div className='sm:w-1/3 md:w-1/3 lg:w-1/3 h-96 mx-auto bg-slate-200 rounded-xl p-5 border'>
				<div className='mb-6 text-center'>
					<h2 className='font-bold text-2xl'>Welcome!</h2>
					<div className='text-white mt-3'>
						<button className={`w-1/4 p-1 rounded-l-lg ${activeButton === 'User' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'} `}
			onClick={() => handleButtonClick('User')}
			>
			User
						</button>
						<button className={`w-1/4 p-1 rounded-r-lg ${activeButton === 'Business' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-zinc-400' : 'hover:bg-amber-400'}`}
			onClick={() => handleButtonClick('Business')}
			>
			Business
						</button>
					</div>
				</div>
				<form onSubmit = {handleLogin}> 
					<div className='mx-auto p-2 space-y-3'>
						<div>
							<h3>Email</h3>
							<input type='email' placeholder='Enter your email' className='rounded-md p-2 w-full italic ps-3' value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div>
							<h3>Password</h3>
							<input type='password' placeholder='Enter your password' className='rounded-md p-2 w-full italic ps-3' />
						</div>
					</div>
				</form>
				<div className='mx-20 mt-3'>
					<button className='text-white bg-amber-500 w-full rounded-md p-2 hover:bg-amber-400'>Sign in</button>
					<div className='text-center space-x-4 text-slate-400'>
						<a href className='text-xs hover:underline underline-offset-4'>Forgot password</a>
						<a href onClick={() => navigate('/register')} className='text-xs hover:underline underline-offset-4'>Create an account</a>
					</div>
				</div>
        	</div>
    	</div>
    </div>
  )
}

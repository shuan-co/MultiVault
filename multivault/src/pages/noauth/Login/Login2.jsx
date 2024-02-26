// Login2.jsx where authentication is done through a "separate" back-end endpoint

import React, { useState } from 'react'
import loginBg from './loginBg.jpg'
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('User');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

    const handleButtonClick = (button) => {
      	setActiveButton(button);
    };    

    const postRequest = async ( route, data) => {
        const response = await fetch(route, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return await response.json();
    }

	const handleLogin = async(e) => {
		e.preventDefault();
		try {
			var email = document.getElementById('email-input').value;
			var password = document.getElementById('password-input').value;
            const data = { email, password };
            const response = postRequest( '/login', data );
            
            if( response.ok ) {
                const { userCredential, token } = response;
                const user = userCredential.user;
                handleRedirect( user.accountType );
            } else {
                setError( data.message || 'Login failed' );
            }
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
                navigate('/inventory');
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
								<input type='email' id = 'email-input' placeholder='Enter your email' className='rounded-md p-2 w-full italic ps-3' />
							</div>
							<div>
								<h3>Password</h3>
								<input type='password' id = 'password-input' placeholder='Enter your password' className='rounded-md p-2 w-full italic ps-3' />
							</div>
						</div>
					<div className='mx-20 mt-3'>
						<button type = 'submit' className='text-white bg-amber-500 w-full rounded-md p-2 hover:bg-amber-400'>Sign in</button>
						<div className='text-center space-x-4 text-slate-400'>
							<a href className='text-xs hover:underline underline-offset-4'>Forgot password</a>
							<a href onClick={() => navigate('/register')} className='text-xs hover:underline underline-offset-4'>Create an account</a>
						</div>
					</div>
					</form>
				</div>
			</div>
		</div>
	  )
	}
import React, { useState, useEffect } from 'react'
import registerBg from './registerBg.jpg'
import { useNavigate } from "react-router-dom";

import { auth, db } from '../../../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from "firebase/firestore";

export default function Register({ user }) {

    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('User');
    const usersCollectionRef = collection(db, "users");

    // Check if user exists
    if (user) {
        navigate('/inventory');
    }
    // Registration Form
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        sex: 'Male',
        birthday: '',
        email: '',
        password: '',
        companyName: '',
        businessType: '',
        businessDesc: '',
        accountType: 'User'
    });

    // Clear Form
    const clearForm = () => {
        setForm({
            firstName: '',
            lastName: '',
            sex: 'Male',
            birthday: '',
            email: '',
            password: '',
            companyName: '',
            businessType: '',
            businessDesc: '',
            accountType: activeButton
        });
    }

    // Updates whenever anything in the form changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Changes Account Type based on activeButton
    useEffect(() => {
        clearForm();
    }, [activeButton])

    // Activates upon clicking register button
    const handleRegister = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, form.email, form.password)
            .then((credentials) => {
                // console.log("Current USer:", auth.currentUser?.email);
                const userDocRef = doc(usersCollectionRef, `${credentials.user.uid}`)
                setDoc(userDocRef, {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    sex: form.sex,
                    birthday: form.birthday,
                    companyName: form.companyName,
                    businessType: form.businessType,
                    businessDesc: form.businessDesc,
                    accountType: form.accountType
                })
                    .then(() => {
                        alert('Registration Successful');
                    })
                    .catch((err) => {
                        console.error(err);
                        alert('Registration Error: Firestore');
                        // Delete authenticated user if firestore storing fails
                        auth.currentUser?.delete()
                            .then(() => {
                                console.log("Firestore Failed: User Deleted");
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    });
            })
            .catch((err) => {
                console.error(err);
                alert('Registration Error: Authentication');
            });
    }

    return (
        <div style={{ backgroundImage: `url(${registerBg})` }} className='flex items-center justify-center h-screen'>
            <div className='w-screen space-y-10'>
                <h1 className='text-center text-white text-8xl inter font-extrabold'>MultiVault</h1>

                {activeButton === 'User' ? (
                    <form className='sm:w-1/3 md:w-1/3 lg:w-1/3 h-fit mx-auto bg-slate-200 rounded-xl p-5 border'
                        onSubmit={handleRegister}>
                        <div className='mb-6 text-center'>
                            <h2 className='font-bold text-2xl'>Sign up</h2>
                            <div className='text-white mt-3'>
                                <button className={`w-1/4 p-1 rounded-l-lg ${activeButton === 'User' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'} `}
                                    onClick={() => setActiveButton('User')}
                                >
                                    User
                                </button>
                                <button className={`w-1/4 p-1 rounded-r-lg ${activeButton === 'Business' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-zinc-400' : 'hover:bg-amber-400'}`}
                                    onClick={() => setActiveButton('Business')}
                                >
                                    Business
                                </button>
                            </div>
                        </div>

                        <div className='mx-auto p-2 space-y-3'>
                            <div>
                                <h3>First Name</h3>
                                <input
                                    type='text'
                                    placeholder='Enter your First Name'
                                    className='rounded-md p-2 w-full italic ps-3'
                                    name='firstName'
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    data-testid="firstName"
                                />
                            </div>

                            <div>
                                <h3>Last Name</h3>
                                <input
                                    type='text'
                                    placeholder='Enter your Last Name'
                                    className='rounded-md p-2 w-full italic ps-3'
                                    name='lastName'
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    data-testid="lastName"
                                />
                            </div>

                            <div className='grid sm:grid-cols-8 gap-5'>
                                <div className='sm:col-span-4'>
                                    <h3>Sex</h3>
                                    <select
                                        id="sex"
                                        name="sex"
                                        autoComplete="sex"
                                        className="text-black block w-full rounded-md border-0 p-3"
                                        defaultValue='Male'
                                        onChange={handleChange}
                                        required
                                        data-testid="sex"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div className='sm:col-span-4'>
                                    <h3>Birthday</h3>
                                    <input
                                        type='date'
                                        className='text-black block w-full rounded-md border-0 p-3'
                                        name='birthday'
                                        value={form.birthday}
                                        onChange={handleChange}
                                        required
                                        data-testid="birthday"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3>Email Address</h3>
                                <input
                                    type='email'
                                    placeholder='Enter your email address'
                                    className='text-black block w-full rounded-md border-0 p-3'
                                    name='email'
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    data-testid="email"
                                />
                            </div>

                            <div>
                                <h3>Password</h3>
                                <input
                                    type='password'
                                    placeholder='Enter your password'
                                    className='text-black block w-full rounded-md border-0 p-3'
                                    name='password'
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    data-testid="password"
                                />
                            </div>
                        </div>


                        <div className='mx-auto p-2 mt-3 grid grid-cols-8 gap-5'>
                            <button onClick={() => navigate('/login')} className='text-white bg-zinc-500 w-full rounded-md p-2 hover:bg-zinc-400 col-span-4'>Cancel</button>
                            <button className='text-white bg-amber-500 w-full rounded-md p-2 hover:bg-amber-400 col-span-4'
                                type='submit'>Register</button>
                        </div>
                    </form>
                ) : (<></>)}

                {activeButton === 'Business' ? (
                    <form className='sm:w-2/5 md:w-2/5 lg:w-2/5 h-fit mx-auto bg-slate-200 rounded-xl p-5 border'
                        onSubmit={handleRegister}>
                        <div className='mb-6 text-center'>
                            <h2 className='text-2xl'>Sign up</h2>
                            <div className='text-white mt-3'>
                                <button className={`w-1/4 p-1 rounded-l-lg ${activeButton === 'User' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'}`}
                                    onClick={() => setActiveButton('User')}
                                >
                                    User
                                </button>
                                <button className={`w-1/4 p-1 rounded-r-lg ${activeButton === 'Business' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'User' ? 'hover:bg-zinc-400' : 'hover:bg-amber-400'}`}
                                    onClick={() => setActiveButton('Business')}
                                >
                                    Business
                                </button>
                            </div>
                        </div>

                        <div className='mx-auto p-2 space-y-3'>
                            <div className='grid grid-cols-8 gap-5'>
                                <div className='col-span-4'>
                                    <h3>Admin First Name</h3>
                                    <input type='text' placeholder='Enter your First Name' className='text-black block w-full rounded-md italic border-0 p-3'
                                        name='firstName' value={form.firstName} onChange={handleChange}
                                        data-testid="firstName" required />
                                </div>

                                <div className='col-span-4'>
                                    <h3>Company Name </h3>
                                    <input type='text' placeholder='Enter Company Name' className='text-black block w-full rounded-md italic border-0 p-3'
                                        name='companyName' value={form.companyName} onChange={handleChange}
                                        data-testid="companyName" required />
                                </div>
                            </div>

                            <div className='grid grid-cols-8 gap-5'>
                                <div className='col-span-4'>
                                    <h3>Admin Last Name</h3>
                                    <input type='text' placeholder='Enter your Last Name' className='text-black block w-full rounded-md italic border-0 p-3'
                                        name='lastName' value={form.lastName} onChange={handleChange}
                                        data-testid="lastName" required />
                                </div>

                                <div className='col-span-4'>
                                    <h3>Business Type</h3>
                                    <input type='text' placeholder='Enter Business Type' className='text-black block w-full rounded-md italic border-0 p-3'
                                        name='businessType' value={form.businessType} onChange={handleChange}
                                        data-testid="businessType" required />
                                </div>
                            </div>

                            <div className='grid grid-cols-8 gap-5'>
                                <div className='col-span-4'>
                                    <div className='grid sm:grid-cols-8 gap-5'>
                                        <div className='sm:col-span-4'>
                                            <h3>Sex</h3>
                                            <select
                                                id="sex"
                                                name="sex"
                                                autoComplete="sex"
                                                className="text-black block w-full rounded-md border-0 p-3"
                                                defaultValue='Male'
                                                onChange={handleChange}
                                                data-testid="sex"
                                                required
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div className='sm:col-span-4'>
                                            <h3>Birthday</h3>
                                            <input type='date' className='text-black block w-full rounded-md italic border-0 p-3'
                                                name='birthday' value={form.birthday} onChange={handleChange}
                                                data-testid="birthday" required />
                                        </div>

                                    </div>

                                    <div>
                                        <h3>Email Address</h3>
                                        <input type='email' placeholder='Enter your email address' className='text-black block w-full rounded-md italic border-0 p-3'
                                            name='email' value={form.email} onChange={handleChange}
                                            data-testid="email" required />
                                    </div>

                                    <div>
                                        <h3>Password</h3>
                                        <input type='password' placeholder='Enter your password' className='text-black block w-full rounded-md italic border-0 p-3'
                                            name='password' value={form.password} onChange={handleChange}
                                            data-testid="password" required />
                                    </div>
                                </div>

                                <div className='col-span-4 flex flex-col'>
                                    <h3>Business Description</h3>
                                    <textarea placeholder='Text' className='text-black block w-full h-full rounded-md italic border-0 p-3'
                                        name='businessDesc' data-testid="businessDesc" value={form.businessDesc} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className='mx-20 mt-3'>
                            <button className='text-white bg-amber-500 w-full rounded-md p-2 hover:bg-amber-400'
                                type='submit'>Register</button>
                        </div>
                    </form>
                ) : (<></>)}
            </div>
        </div>
    );
}
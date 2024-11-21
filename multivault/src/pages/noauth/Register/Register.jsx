import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../../firebase/firebase';
import { ROLES } from '../roles';
import { securityService } from '../../../utils/authSecurity';
import { validationService } from '../../../utils/validationService';
import { loggingService } from '../../../utils/LoggingService';
import registerBg from './registerBg.jpg';

const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    maxLength: 32,
    patterns: {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*]/
    }
};

export default function Register({ user }) {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('Customer');
    const [showAdminCode, setShowAdminCode] = useState(false);
    const usersCollectionRef = collection(db, "users");
    const ADMIN_SECRET_CODE = "ADMIN123";
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    

    const [selectedQuestions, setSelectedQuestions] = useState({
        question1: '',
        question2: '',
        question3: ''
    });

    const [securityAnswers, setSecurityAnswers] = useState({
        question1: '',
        question2: '',
        question3: ''
    });

    const [availableQuestions] = useState([
        "What was the name of your first pet?",
        "In what city were you born?",
        "What was your first car?",
        "What elementary school did you attend?",
        "What is your mother's maiden name?",
        "What is the name of your first childhood friend?",
        "What street did you grow up on?",
        "What was your high school mascot?",
        "What is your father's middle name?",
        "What was the first concert you attended?"
    ]);

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
        role: ROLES.CUSTOMER,
        staffRole: '',
        secretCode: '',
        businessId: '',
    });

    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < PASSWORD_REQUIREMENTS.minLength || 
            password.length > PASSWORD_REQUIREMENTS.maxLength) {
            errors.push(`Password must be between ${PASSWORD_REQUIREMENTS.minLength} and ${PASSWORD_REQUIREMENTS.maxLength} characters`);
        }
        
        if (!PASSWORD_REQUIREMENTS.patterns.uppercase.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!PASSWORD_REQUIREMENTS.patterns.lowercase.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!PASSWORD_REQUIREMENTS.patterns.number.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!PASSWORD_REQUIREMENTS.patterns.special.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*)');
        }

        return errors;
    };

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
            role: ROLES.CUSTOMER,
            staffRole: '',
            secretCode: '',
            businessId: '',
            accountType: activeButton
        });
        setSelectedQuestions({
            question1: '',
            question2: '',
            question3: ''
        });
        setSecurityAnswers({
            question1: '',
            question2: '',
            question3: ''
        });
    };

    useEffect(() => {
        clearForm();
    }, [activeButton]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.altKey && event.key === 'a') {
                setShowAdminCode(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));

        if (name === 'password') {
            const errors = validatePassword(value);
            setPasswordErrors(errors);
        }
    };

    const handleSecurityQuestionChange = (questionNumber, question) => {

        const otherSelections = Object.entries(selectedQuestions)
            .filter(([key]) => key !== questionNumber)
            .map(([_, value]) => value);

        if (otherSelections.includes(question)) {
            alert('This security question has already been selected. Please choose a different one.');
            return;
        }

        setSelectedQuestions(prev => ({
            ...prev,
            [questionNumber]: question
        }));
    };

    const handleSecurityAnswerChange = (questionNumber, answer) => {
        setSecurityAnswers(prev => ({
            ...prev,
            [questionNumber]: answer
        }));
    };

    const validateSecurityQuestions = () => {

        const allQuestionsSelected = Object.values(selectedQuestions).every(q => q !== '');
        if (!allQuestionsSelected) {
            alert('Please select all three security questions.');
            return false;
        }


        const allAnswersValid = Object.values(securityAnswers).every(a => a.length >= 2);
        if (!allAnswersValid) {
            alert('Please provide answers for all security questions (minimum 2 characters).');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);


        if (!validateSecurityQuestions()) {
            setLoading(false);
            return;
        }
    
        const passwordValidationErrors = validatePassword(form.password);
        if (passwordValidationErrors.length > 0) {
            await loggingService.logValidationFailure(
                'Register',
                'password',
                'Password validation failed',
                null
            );
            setPasswordErrors(passwordValidationErrors);
            setLoading(false);
            return;
        }
    
        try {
            const credentials = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const userDocRef = doc(usersCollectionRef, credentials.user.uid);
            
            let role = ROLES.CUSTOMER;
            
            if (form.secretCode === ADMIN_SECRET_CODE) {
                role = ROLES.ADMIN;
                await loggingService.logEvent(
                    'admin_account_creation',
                    { userId: credentials.user.uid },
                    null,
                    'warning'
                );
            } else if (activeButton === 'Business') {
                role = ROLES.BUSINESS_OWNER;
            } else if (activeButton === 'Staff') {
                role = ROLES.STAFF;
            }


            const securityQuestionsData = {};
            Object.entries(selectedQuestions).forEach(([key, question]) => {
                if (question && securityAnswers[key]) {
                    securityQuestionsData[question] = securityAnswers[key];
                }
            });
    
            await setDoc(doc(db, 'loginAttempts', form.email), {
                count: 0,
                lastAttempt: null,
                lockedUntil: null
            });
    
            await setDoc(userDocRef, {
                firstName: form.firstName,
                lastName: form.lastName,
                sex: form.sex,
                birthday: form.birthday,
                email: form.email,
                companyName: form.companyName,
                businessType: form.businessType,
                businessDesc: form.businessDesc,
                role: role,
                staffRole: form.staffRole || null,
                created: new Date().toISOString(),
                businessId: activeButton === 'Staff' ? form.businessId : null,
                lastPasswordChange: new Date().toISOString(),
                securityQuestions: securityQuestionsData
            });
    
            await setDoc(doc(db, `users/${credentials.user.uid}/security/passwordHistory`), {
                passwords: [form.password],
                lastChanged: new Date().toISOString()
            });
    
            await loggingService.logEvent(
                'user_registration',
                {
                    userId: credentials.user.uid,
                    role: role,
                    accountType: activeButton,
                    email: form.email,
                    createdAt: new Date().toISOString()
                },
                credentials.user.uid,
                'info'
            );
    
            if (role === ROLES.ADMIN) {
                await loggingService.logEvent(
                    'admin_registration',
                    {
                        userId: credentials.user.uid,
                        email: form.email,
                        createdAt: new Date().toISOString()
                    },
                    credentials.user.uid,
                    'warning'
                );
                alert('Admin Account Created Successfully');
            } else {
                alert('Registration Successful');
            }
            
            setLoading(false);
            navigate('/login');
        } catch (error) {
            await loggingService.logEvent(
                'registration_error',
                {
                    error: error.message,
                    attemptedEmail: form.email,
                    attemptedRole: activeButton,
                    timestamp: new Date().toISOString()
                },
                null,
                'error'
            );
            console.error('Registration error:', error);
            alert('Registration Error: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundImage: `url(${registerBg})` }} className='flex items-center justify-center min-h-screen py-10'>
            <div className='w-screen space-y-10'>
                <h1 className='text-center text-white text-8xl inter font-extrabold'>MultiVault</h1>

                <form className='w-11/12 sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-1/3 h-fit mx-auto bg-slate-200 rounded-xl p-5 border'
                    onSubmit={handleRegister}>
                    <div className='mb-6 text-center'>
                        <h2 className='font-bold text-2xl'>Sign up</h2>
                        <div className='text-white mt-3'>
                            <button 
                                type="button"
                                className={`w-1/3 p-1 rounded-l-lg ${activeButton === 'Customer' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'Customer' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'}`}
                                onClick={() => setActiveButton('Customer')}
                            >
                                Customer
                            </button>
                            <button 
                                type="button"
                                className={`w-1/3 p-1 ${activeButton === 'Business' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'Business' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'}`}
                                onClick={() => setActiveButton('Business')}
                            >
                                Business
                            </button>
                            <button 
                                type="button"
                                className={`w-1/3 p-1 rounded-r-lg ${activeButton === 'Staff' ? 'bg-amber-500' : 'bg-zinc-500'} ${activeButton === 'Staff' ? 'hover:bg-amber-400' : 'hover:bg-zinc-400'}`}
                                onClick={() => setActiveButton('Staff')}
                            >
                                Staff
                            </button>
                        </div>
                    </div>

                    {passwordErrors.length > 0 && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                            {passwordErrors.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </div>
                    )}

                    <div className='mx-auto p-2 space-y-3'>
                        <div className='grid grid-cols-2 gap-4'>
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
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <h3>Sex</h3>
                                <select
                                    name="sex"
                                    className="text-black block w-full rounded-md border-0 p-3"
                                    value={form.sex}
                                    onChange={handleChange}
                                    required
                                    data-testid="sex"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
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

                        {activeButton === 'Business' && (
                            <div className='space-y-3'>
                                <div>
                                    <h3>Company Name</h3>
                                    <input
                                        type='text'
                                        placeholder='Enter Company Name'
                                        className='rounded-md p-2 w-full italic ps-3'
                                        name='companyName'
                                        value={form.companyName}
                                        onChange={handleChange}
                                        required
                                        data-testid="companyName"
                                        />
                                </div>
                            </div>
                        )}

                        {activeButton === 'Staff' && (
                            <div className='space-y-3'>
                            </div>
                        )}

                        {showAdminCode && (
                            <div className='space-y-3'>
                                <div>
                                    <h3>Admin Code</h3>
                                    <input
                                        type='text'
                                        placeholder='Enter Admin Code'
                                        className='rounded-md p-2 w-full italic ps-3'
                                        name='secretCode'
                                        value={form.secretCode}
                                        onChange={handleChange}
                                        data-testid="adminCode"
                                    />
                                </div>
                            </div>
                        )}

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

                        <div className="text-sm text-gray-600 mt-2">
                            <p>Password Requirements:</p>
                            <ul className="list-disc pl-5">
                                <li>8-32 characters long</li>
                                <li>At least one uppercase letter</li>
                                <li>At least one lowercase letter</li>
                                <li>At least one number</li>
                                <li>At least one special character (!@#$%^&*)</li>
                            </ul>
                        </div>


                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Security Questions</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Please select and answer three different security questions. These will help verify your identity if you need to reset your password.
                            </p>
                            
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="mb-4">
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Security Question {num}
                                        </label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2"
                                            value={selectedQuestions[`question${num}`]}
                                            onChange={(e) => handleSecurityQuestionChange(`question${num}`, e.target.value)}
                                            required
                                        >
                                            <option value="">Select a security question</option>
                                            {availableQuestions
                                                .filter(q => !Object.values(selectedQuestions).includes(q) || 
                                                           selectedQuestions[`question${num}`] === q)
                                                .map((question, idx) => (
                                                    <option key={idx} value={question}>
                                                        {question}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Your Answer
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2"
                                            placeholder="Enter your answer"
                                            value={securityAnswers[`question${num}`]}
                                            onChange={(e) => handleSecurityAnswerChange(`question${num}`, e.target.value)}
                                            required
                                            minLength="2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mx-auto p-2 mt-5 grid grid-cols-2 gap-4'>
                        <button 
                            type="button"
                            onClick={() => navigate('/login')} 
                            className='text-white bg-zinc-500 w-full rounded-md p-2 hover:bg-zinc-400'
                        >
                            Cancel
                        </button>
                        <button 
                            type='submit'
                            className='text-white bg-amber-500 w-full rounded-md p-2 hover:bg-amber-400'
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className='mx-auto text-center mt-5'>
                    <button 
                        type="button"
                        className='text-slate-100 hover:underline underline-offset-2' 
                        onClick={() => navigate('/landing')}
                    >
                        Back Home?
                    </button>
                </div>
            </div>
        </div>
    );
}
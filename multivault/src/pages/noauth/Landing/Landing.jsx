import React from 'react'
import defaultImg from './defaultImg.jpg'
import hamster from './hamster.jpg'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHourglassEnd, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase/firebase.js'
import { signOut } from 'firebase/auth'

const shoppingCart = <FontAwesomeIcon icon={faCartShopping} />
const hourGlass = <FontAwesomeIcon icon={faHourglassEnd} />
const truckFast = <FontAwesomeIcon icon={faTruckFast} />

export default function Landing() {
    const navigate = useNavigate()

    useEffect(() => {
        const navbar = document.getElementById('navbar');
    
        const handleScroll = () => {
          if (window.scrollY > 0) {
            // Change the background color when scrolling down
            navbar.style.backgroundColor = 'black'; // Replace with your desired color
            navbar.style.position = 'fixed';
            navbar.style.width = '100%';
            navbar.style.top = '0';
          } else {
            // Reset styles when at the top
            navbar.style.backgroundColor = 'transparent'; // Replace with your default background color
            navbar.style.position = 'static';
            navbar.style.width = 'auto';
            navbar.style.top = 'auto';
          }
        };
    
        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

      const handleLogout = () => {
        signOut(auth).then(() => {
          alert("Logged out Successfully");
          navigate('/login')
        }).catch((err) => {
          alert('Log out error');
          console.error(err);
        });
      }

  return (
    <div id='multivault' className='bg-white w-screen h-screen'>
        <div style={{ backgroundImage: `url(${defaultImg})` }} className='h-5/6 bg-center bg-cover bg-no-repeat'>
            <div id='navbar' className='mx-auto flex justify-between p-5 px-60'>
                <button className='uppercase text-amber-300 italic text-2xl'
                        onClick={() => {
                            const tellMeMoreElement = document.getElementById('multivault');
                            if (tellMeMoreElement) {
                                tellMeMoreElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        >MultiVault</button>
                <div className='flex justify-between gap-10'>
                    <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => navigate('/inventory')}>
                        Inventory
                    </button>
                    <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => {
                                const tellMeMoreElement = document.getElementById('tellMeMore');
                                if (tellMeMoreElement) {
                                    tellMeMoreElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            >Services</button>
                    <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => {
                                const tellMeMoreElement = document.getElementById('about');
                                if (tellMeMoreElement) {
                                    tellMeMoreElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            >About</button>
                    <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => {
                                const tellMeMoreElement = document.getElementById('team');
                                if (tellMeMoreElement) {
                                    tellMeMoreElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            >Team</button>
                    <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => {
                                const tellMeMoreElement = document.getElementById('faq');
                                if (tellMeMoreElement) {
                                    tellMeMoreElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            >Faq</button>
                    {auth.currentUser ? (
                        <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => handleLogout()}>Logout
                        </button>
                        )  : ( 
                        <button className='uppercase text-white hover:text-amber-300'
                            onClick={() => navigate('/login')}>Login
                        </button>
                       )}
                </div>
            </div>

            <div className='mx-auto text-white text-center h-5/6 flex items-center justify-center'>
                <div className='space-y-5'>
                    <h1 className='text-4xl italic'>Welcome To</h1>
                    <h1 className='text-6xl font-bold'>MULTIVAULT</h1>
                    <button className='uppercase font-bold p-4 w-1/2 rounded-lg bg-amber-500' 
                            onClick={() => {
                                const tellMeMoreElement = document.getElementById('tellMeMore');
                                if (tellMeMoreElement) {
                                    tellMeMoreElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}>Tell me more
                    </button>
                </div>
            </div>
        </div>
        <div id='tellMeMore' className='bg-white p-20 px-60'>
            <div className='space-y-20 pb-28'>
                <div className='mx-auto text-center space-y-8'>
                    <h1 className='uppercase font-bold text-4xl'>What is Multivault</h1>
                    <h3 className='italic text-zinc-500 text-sm'>An inventory management system for food and beverages, for owners of businesses that include food and beverages this will mean that they will be far more efficient in managing their own stock and be able to ensure that they keep their losses due to expiry/mismanagement to a minimum.</h3>
                </div>

                <div className='flex space-between gap-5 grid grid-cols-3'>
                    <div className='col-span-1 text-center space-y-3'>
                        <div className='bg-yellow-500 w-36 h-36 mx-auto text-6xl text-white p-8 flex items-center justify-center rounded-full mb-9'>
                            {shoppingCart}
                        </div>
                        <h1 className='font-bold text-xl'>Inventory Tracking</h1>
                        <h3 className='text-sm text-zinc-500'>Real Time Inventory tracking which will allow the user to monitor the status of perishable and none perishable goods in real time. This should also update the user on stock levels in order to prevent shortages or excess inventory.</h3>
                    </div>

                    <div className='col-span-1 text-center space-y-3'>
                        <div className='bg-yellow-500 w-36 h-36 mx-auto text-6xl text-white p-8 flex items-center justify-center rounded-full mb-9'>
                            {hourGlass}
                        </div>
                        <h1 className='font-bold text-xl'>Expiration Date Tracking</h1>
                        <h3 className='text-sm text-zinc-500'>Expiration date tracking which will help the user to track the expiration date of food items and gives automated alerts for those that are near expiry.</h3>
                    </div>

                    <div className='col-span-1 text-center space-y-3'>
                        <div className='bg-yellow-500 w-36 h-36 mx-auto text-6xl text-white p-8 flex items-center justify-center rounded-full mb-9'>
                            {truckFast}
                        </div>
                        <h1 className='font-bold text-xl'>Supplier Integration</h1>
                        <h3 className='text-sm text-zinc-500'>Integrates the ability to facilitate streamlined communication and order processes with suppliers.</h3>
                    </div>
                </div>
            </div>
            <div id='about' className='text-center space-y-10 pt-12'>
                <div className='space-y-3'>
                    <h1 className='uppercase font-bold text-3xl'>About</h1>
                    <h3 className='text-sm text-zinc-500 italic'>MultiVault History</h3>
                </div>

                <div className='space-y-12'>
                    <div className='grid grid-cols-5'>
                        <div className=' col-span-2 text-right flex items-center justify-center'>
                            <div className='mx-auto w-full'>
                                <h1 className='font-bold text-xl'>January 2024</h1>
                                <h2 className='font-bold text-xl'>Our Humble Beginnings</h2>
                                <h3>Our team formed to start the MultiVault project for a major subject in our program</h3>
                            </div>
                        </div>

                        <div className='bg-yellow-500 p-14 rounded-full w-40 border-4 col-span-1 mx-auto'>
                            <h1 className='text-white text-4xl'>1</h1>
                        </div>
                        
                        <div className=' col-span-2'>

                        </div>
                            
                    </div>

                    <div className='grid grid-cols-5'>
                        <div className='col-span-2 '>

                        </div>

                        <div className='bg-yellow-500 p-14 rounded-full w-40 border-4 col-span-1 mx-auto'>
                            <h1 className='text-white text-4xl'>2</h1>
                        </div>

                        <div className='  col-span-2 text-left flex items-center justify-center'>
                            <div className='w-full'>
                                <h1 className='font-bold text-xl'>February 2024</h1>
                                <h2 className='font-bold text-xl'>Progression</h2>
                                <h3>Our team made significant progress in the development of MultiVault.</h3>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-5'>
                        <div className=' col-span-2 text-right flex items-center me-0'>
                            <div className='w-full'>
                                <h1 className='font-bold text-xl'>March 2024</h1>
                                <h2 className='font-bold text-xl'>Launch</h2>
                                <h3>Our team successfully launched the MultiVault Application</h3>
                            </div>
                            
                        </div>

                        <div className='bg-yellow-500 p-14 rounded-full w-40 h-40 border-4 col-span-1 mx-auto'>
                            <h1 className='text-white text-4xl'>3</h1>
                        </div>

                        <div className=' col-span-2'>

                        </div>
                    </div>                
                </div>
            </div>
        </div>

        <div id='team' className='bg-gray-100 p-20 px-60 space-y-14'>
            <div className='text-center space-y-4'>
                <h1 className='text-4xl font-bold uppercase'>Our amazing team</h1>
                <h3 className='text-sm italic text-zinc-500'>Meet the people behind the project</h3>
            </div>

            <div className='grid grid-cols-3'>
                <div className='mx-auto text-center'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>Shuan Noel Co</h1>
                    <h3 className='text-sm text-zinc-500'>Quality Assurance & Scrum Master</h3>
                </div>

                <div className='text-center'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>John Marc Gregorio</h1>
                    <h3 className='text-sm text-zinc-500'>Product Owner & Developer</h3>
                </div>

                <div className='text-center'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>Darius Ardales</h1>
                    <h3 className='text-sm text-zinc-500'>Developer</h3>
                </div>
            </div>

            <div className='grid grid-cols-3'>
                <div className='mx-auto text-center'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>John Patrick Marcellana</h1>
                    <h3 className='text-sm text-zinc-500'>Developer</h3>
                </div>

                <div className='text-center'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>Sebastian Dela Cruz</h1>
                    <h3 className='text-sm text-zinc-500'>Developer</h3>
                </div>

                <div className='text-center'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>Samantha Caasi</h1>
                    <h3 className='text-sm text-zinc-500'>Designer</h3>
                </div>
            </div>

            <div className='grid grid-cols-3'>
                <div className='mx-auto text-center col-span-3'>
                    <div className='w-44 h-44 rounded-full border-4 border-gray-200 bg-cover bg-no-repeat bg-center mx-auto mb-2' style={{ backgroundImage: `url(${hamster})`}}>
                        
                    </div>
                    <h1 className='font-bold text-xl'>Jose Romulo Latosa</h1>
                    <h3 className='text-sm text-zinc-500'>Designer</h3>
                </div>
            </div>
        </div>

        <div id='faq' className='bg-white p-20 px-60 space-y-16'>
            <div>
                <h1 className='font-bold text-center text-3xl uppercase'>Frequently Asked Questions</h1>
            </div>

            <div className='grid grid-cols-3 gap-10'>
                <div className='text-center space-y-10'>
                    <h1 className='text-xl font-bold leading-none'>What is Multivault, and how does it work?</h1>

                    <h3 className='text-zinc-500 text-sm'>
                    MultiVault is an advanced inventory management system designed to monitor and track the quantity of items, along with their expiration dates. It utilizes cutting-edge technology to provide real-time updates and alerts, ensuring efficient management and preventing expiration-related issues.
                    </h3>
                </div>

                <div className='text-center space-y-10'>
                    <h1 className='text-xl font-bold leading-none'>What features does Multivault offer?</h1>

                    <h3 className='text-zinc-500 text-sm'>MultiVault  employs a user-friendly interface to input and monitor item quantities. Users can easily update inventory levels, receive automated notifications for low stock, and view comprehensive reports for better decision-making.</h3>
                </div>

                <div className='text-center space-y-10'>
                    <h1 className='text-xl font-bold leading-none'>How does MultiVault handle item expiration dates?</h1>

                    <h3 className='text-zinc-500 text-sm'>The system efficiently manages expiration dates by allowing users to input and track them for each item. Automated alerts are sent as an item approaches its expiration date, ensuring timely action to prevent waste and maintain product quality.</h3>
                </div>
            </div>
        </div>

        <div>

        </div>
    </div>
  )
}
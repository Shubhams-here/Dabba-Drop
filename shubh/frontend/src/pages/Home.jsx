import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import { useNavigate } from 'react-router-dom'
import image4 from '../assets/image4.avif'
import image8 from '../assets/image8.avif'
import image10 from '../assets/image10.avif'
import { gsap } from 'gsap'
import { FaUtensils, FaClock, FaMapMarkerAlt, FaStar, FaUsers, FaTruck, FaShieldAlt, FaMobileAlt } from 'react-icons/fa'

function Home() {
    const {userData}=useSelector(state=>state.user)
    const navigate = useNavigate()

    const logoRef = useRef(null)
    const navButtonsRef = useRef(null)
    const heroRef = useRef(null)
    const aboutRef = useRef(null)
    const featuresRef = useRef(null)
    const howItWorksRef = useRef(null)
    const statsRef = useRef(null)

    useEffect(() => {
        if (!userData) {
            const tl = gsap.timeline()

            // Animate logo from left
            tl.fromTo(logoRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            )

            // Animate nav buttons
            .fromTo(navButtonsRef.current,
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                "-=0.4"
            )

            // Animate hero section
            .fromTo(heroRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.3"
            )

            // Animate about section
            .fromTo(aboutRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.2"
            )

            // Animate features
            .fromTo(featuresRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    stagger: 0.1
                },
                "-=0.4"
            )

            // Animate how it works
            .fromTo(howItWorksRef.current.children,
                { scale: 0, rotation: 45, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    stagger: 0.2
                },
                "-=0.3"
            )

            // Animate stats
            .fromTo(statsRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.1
                },
                "-=0.2"
            )
        }
    }, [userData])

    if (!userData) {
        return (
            <div className='w-full min-h-screen bg-[#fff9f6]'>
                {/* Navigation */}
                <nav className='w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-8 lg:px-20 fixed top-0 z-50 bg-[#fff9f6] shadow-sm'>
                    <h1 ref={logoRef} className='text-2xl md:text-3xl font-bold text-[#ff4d2d]'>DabbaDrop</h1>
                    <div ref={navButtonsRef} className='flex items-center gap-2 md:gap-4'>
                        <button
                            className='px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20 transition-all duration-300 hover:scale-105'
                            onClick={() => navigate('/contact-us')}
                        >
                            Contact Us
                        </button>
                        <button
                            className='px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-[#ff4d2d] text-white font-medium hover:bg-[#e04325] transition-all duration-300 hover:scale-105'
                            onClick={() => navigate('/signin')}
                        >
                            Sign In
                        </button>
                        <button
                            className='px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20 transition-all duration-300 hover:scale-105'
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <section ref={heroRef} className='pt-16 md:pt-20 pb-12 md:pb-20 px-4 md:px-8 lg:px-20'>
                    <div className='max-w-6xl mx-auto text-center'>
                        <h2 className='text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6'>
                            Welcome to <span className='text-[#ff4d2d]'>DabbaDrop</span>
                        </h2>
                        <p className='text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed'>
                            Discover and order delicious food from your favorite local restaurants. Fresh, fast, and right to your doorstep with our seamless food delivery platform.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12'>
                            <button
                                className='px-6 md:px-8 py-3 md:py-4 rounded-lg bg-[#ff4d2d] text-white font-medium text-base md:text-lg hover:bg-[#e04325] transition-all duration-300 hover:scale-110 hover:shadow-lg'
                                onClick={() => navigate('/signin')}
                            >
                                Get Started
                            </button>
                            <button
                                className='px-6 md:px-8 py-3 md:py-4 rounded-lg border-2 border-[#ff4d2d] text-[#ff4d2d] font-medium text-base md:text-lg hover:bg-[#ff4d2d] hover:text-white transition-all duration-300'
                                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Learn More
                            </button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto'>
                            <div className='bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                                <img src={image4} alt="Delicious food" className='w-full h-32 md:h-40 object-cover rounded-lg mb-3 hover:scale-105 transition-transform duration-300' />
                                <h3 className='font-semibold text-gray-800'>Fresh & Delicious</h3>
                            </div>
                            <div className='bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                                <img src={image8} alt="Fresh ingredients" className='w-full h-32 md:h-40 object-cover rounded-lg mb-3 hover:scale-105 transition-transform duration-300' />
                                <h3 className='font-semibold text-gray-800'>Quality Ingredients</h3>
                            </div>
                            <div className='bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                                <img src={image10} alt="Restaurant dishes" className='w-full h-32 md:h-40 object-cover rounded-lg mb-3 hover:scale-105 transition-transform duration-300' />
                                <h3 className='font-semibold text-gray-800'>Local Favorites</h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" ref={aboutRef} className='py-12 md:py-20 px-4 md:px-8 lg:px-20 bg-white'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
                            <div>
                                <h2 className='text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6'>
                                    About <span className='text-[#ff4d2d]'>DabbaDrop</span>
                                </h2>
                                <p className='text-gray-600 mb-4 md:mb-6 leading-relaxed'>
                                    DabbaDrop is your ultimate food delivery companion, connecting you with the best local restaurants in your city. We believe that great food should be accessible to everyone, anytime, anywhere.
                                </p>
                                <p className='text-gray-600 mb-4 md:mb-6 leading-relaxed'>
                                    Our platform empowers local restaurants to reach more customers while providing you with a seamless ordering experience. From quick bites to gourmet meals, we deliver happiness right to your doorstep.
                                </p>
                                <div className='flex flex-wrap gap-4'>
                                    <div className='flex items-center gap-2 text-[#ff4d2d]'>
                                        <FaUtensils />
                                        <span className='font-medium'>200+ Restaurants</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-[#ff4d2d]'>
                                        <FaUsers />
                                        <span className='font-medium'>10,000+ Happy Customers</span>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='bg-[#fff9f6] p-4 md:p-6 rounded-xl text-center'>
                                    <FaClock className='text-3xl text-[#ff4d2d] mx-auto mb-3' />
                                    <h3 className='font-semibold text-gray-800 mb-2'>Fast Delivery</h3>
                                    <p className='text-sm text-gray-600'>30-45 minutes delivery</p>
                                </div>
                                <div className='bg-[#fff9f6] p-4 md:p-6 rounded-xl text-center'>
                                    <FaShieldAlt className='text-3xl text-[#ff4d2d] mx-auto mb-3' />
                                    <h3 className='font-semibold text-gray-800 mb-2'>Quality Assured</h3>
                                    <p className='text-sm text-gray-600'>Fresh & hygienic food</p>
                                </div>
                                <div className='bg-[#fff9f6] p-4 md:p-6 rounded-xl text-center'>
                                    <FaMapMarkerAlt className='text-3xl text-[#ff4d2d] mx-auto mb-3' />
                                    <h3 className='font-semibold text-gray-800 mb-2'>Local Focus</h3>
                                    <p className='text-sm text-gray-600'>Support local businesses</p>
                                </div>
                                <div className='bg-[#fff9f6] p-4 md:p-6 rounded-xl text-center'>
                                    <FaStar className='text-3xl text-[#ff4d2d] mx-auto mb-3' />
                                    <h3 className='font-semibold text-gray-800 mb-2'>Best Ratings</h3>
                                    <p className='text-sm text-gray-600'>4.8/5 average rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section ref={featuresRef} className='py-12 md:py-20 px-4 md:px-8 lg:px-20 bg-[#fff9f6]'>
                    <div className='max-w-6xl mx-auto text-center'>
                        <h2 className='text-2xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12'>
                            Why Choose <span className='text-[#ff4d2d]'>DabbaDrop</span>?
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                            <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <FaMobileAlt className='text-4xl text-[#ff4d2d] mb-4 mx-auto' />
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Easy Ordering</h3>
                                <p className='text-gray-600'>Order food from your favorite restaurants with just a few taps on your mobile device.</p>
                            </div>
                            <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <FaTruck className='text-4xl text-[#ff4d2d] mb-4 mx-auto' />
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Fast Delivery</h3>
                                <p className='text-gray-600'>Get your food delivered hot and fresh within 30-45 minutes to your doorstep.</p>
                            </div>
                            <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <FaStar className='text-4xl text-[#ff4d2d] mb-4 mx-auto' />
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Quality Food</h3>
                                <p className='text-gray-600'>Enjoy high-quality, hygienic food prepared by professional chefs at local restaurants.</p>
                            </div>
                            <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <FaMapMarkerAlt className='text-4xl text-[#ff4d2d] mb-4 mx-auto' />
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Local Discovery</h3>
                                <p className='text-gray-600'>Discover amazing local restaurants and hidden gems in your neighborhood.</p>
                            </div>
                            <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <FaShieldAlt className='text-4xl text-[#ff4d2d] mb-4 mx-auto' />
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Secure Payments</h3>
                                <p className='text-gray-600'>Safe and secure payment options with multiple payment methods available.</p>
                            </div>
                            <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <FaUsers className='text-4xl text-[#ff4d2d] mb-4 mx-auto' />
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Community Support</h3>
                                <p className='text-gray-600'>Support local businesses and be part of a growing food delivery community.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section ref={howItWorksRef} className='py-12 md:py-20 px-4 md:px-8 lg:px-20 bg-white'>
                    <div className='max-w-6xl mx-auto text-center'>
                        <h2 className='text-2xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12'>
                            How It <span className='text-[#ff4d2d]'>Works</span>
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
                            <div className='flex flex-col items-center'>
                                <div className='w-16 h-16 bg-[#ff4d2d] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4'>1</div>
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Choose Restaurant</h3>
                                <p className='text-gray-600 text-center'>Browse through our curated list of local restaurants and select your favorite dishes.</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='w-16 h-16 bg-[#ff4d2d] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4'>2</div>
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Place Order</h3>
                                <p className='text-gray-600 text-center'>Add items to your cart, customize your order, and complete your payment securely.</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='w-16 h-16 bg-[#ff4d2d] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4'>3</div>
                                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Enjoy Delivery</h3>
                                <p className='text-gray-600 text-center'>Sit back and relax while our delivery partners bring your delicious food right to you.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section ref={statsRef} className='py-12 md:py-20 px-4 md:px-8 lg:px-20 bg-[#ff4d2d]'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center'>
                            <div className='text-white'>
                                <div className='text-3xl md:text-4xl font-bold mb-2'>200+</div>
                                <div className='text-sm md:text-base opacity-90'>Partner Restaurants</div>
                            </div>
                            <div className='text-white'>
                                <div className='text-3xl md:text-4xl font-bold mb-2'>50K+</div>
                                <div className='text-sm md:text-base opacity-90'>Orders Delivered</div>
                            </div>
                            <div className='text-white'>
                                <div className='text-3xl md:text-4xl font-bold mb-2'>4.8</div>
                                <div className='text-sm md:text-base opacity-90'>Average Rating</div>
                            </div>
                            <div className='text-white'>
                                <div className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>24/7</div>
                                <div className='text-xs md:text-sm lg:text-base opacity-90'>Customer Support</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className='py-8 md:py-12 px-4 md:px-8 lg:px-20 bg-gray-800 text-white'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            <div>
                                <h3 className='text-xl font-bold text-[#ff4d2d] mb-4'>DabbaDrop</h3>
                                <p className='text-gray-300 mb-4'>Your ultimate food delivery companion, connecting you with the best local restaurants.</p>
                                <div className='flex gap-4'>
                                    <button onClick={() => navigate('/contact-us')} className='text-gray-300 hover:text-[#ff4d2d] transition-colors'>Contact Us</button>
                                </div>
                            </div>
                            <div>
                                <h4 className='font-semibold mb-4'>Quick Links</h4>
                                <ul className='space-y-2 text-gray-300'>
                                    <li><button onClick={() => navigate('/signin')} className='hover:text-[#ff4d2d] transition-colors'>Sign In</button></li>
                                    <li><button onClick={() => navigate('/signup')} className='hover:text-[#ff4d2d] transition-colors'>Sign Up</button></li>
                                    <li><button onClick={() => navigate('/contact-us')} className='hover:text-[#ff4d2d] transition-colors'>Support</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className='font-semibold mb-4'>Services</h4>
                                <ul className='space-y-2 text-gray-300'>
                                    <li>Food Delivery</li>
                                    <li>Restaurant Partnership</li>
                                    <li>Delivery Services</li>
                                    <li>Customer Support</li>
                                </ul>
                            </div>
                        </div>
                        <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400'>
                            <p>&copy; 2025 DabbaDrop. All rights reserved. Made with ❤️ for food lovers.</p>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }

  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {userData.role=="user" && <UserDashboard/>}
      {userData.role=="owner" && <OwnerDashboard/>}
      {userData.role=="deliveryBoy" && <DeliveryBoy/>}
    </div>
  )
}

export default Home

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData, setCurrentAddress } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'
import Nav from '../components/Nav'
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaStore, FaMapMarkerAlt, FaTruck, FaWallet, FaCheckCircle, FaEdit, FaTimes, FaGift, FaQuestionCircle, FaCopy, FaCheck, FaChevronDown, FaChevronUp, FaComments, FaPaperPlane } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'

function Profile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    
    const { userData } = useSelector(state => state.user)
    const { myShopData } = useSelector(state => state.owner)
    
    // UI state
    const [editProfileOpen, setEditProfileOpen] = useState(false)
    const [changePasswordOpen, setChangePasswordOpen] = useState(false)
    const [editShopOpen, setEditShopOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // Profile form state
    const [fullName, setFullName] = useState(userData?.fullName || "")
    const [mobile, setMobile] = useState(userData?.mobile || "")

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    // Shop form state (for owner)
    const [shopName, setShopName] = useState(myShopData?.name || "")
    const [shopCity, setShopCity] = useState(myShopData?.city || "")
    const [shopState, setShopState] = useState(myShopData?.state || "")
    const [shopAddress, setShopAddress] = useState(myShopData?.address || "")
    const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
    const [backendImage, setBackendImage] = useState(null)

    // User extra info
    const [userOrdersCount, setUserOrdersCount] = useState(0)
    const [userAddress, setUserAddress] = useState("")
    const [updatingLocation, setUpdatingLocation] = useState(false)

    // Offers & Help state
    const [copiedCode, setCopiedCode] = useState(null)
    const [activeFaq, setActiveFaq] = useState(null)
    const [chatOpen, setChatOpen] = useState(false)
    const [chatMessage, setChatMessage] = useState("")
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: 'Hello! I am your Dabba-Drop assistant. How can I help you today?' }
    ])
    const [isTyping, setIsTyping] = useState(false)

    // Delivery stats
    const [todayDeliveriesCount, setTodayDeliveriesCount] = useState(0)

    useEffect(() => {
        if (!userData) {
            navigate('/signin')
            return
        }

        // Fetch role specific data
        if (userData.role === 'user') {
            fetchUserOrders()
            resolveUserAddress()
        } else if (userData.role === 'owner') {
            fetchOwnerShop()
        } else if (userData.role === 'deliveryBoy') {
            fetchDeliveryStats()
        }
    }, [userData])

    // Scroll to section with a dynamic glow highlight
    useEffect(() => {
        if (location.state?.scrollTo === 'offers') {
            setTimeout(() => {
                const element = document.getElementById('offers-section')
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.classList.add('ring-4', 'ring-[#ff4d2d]/30')
                    setTimeout(() => element.classList.remove('ring-4', 'ring-[#ff4d2d]/30'), 2000)
                }
            }, 300)
        } else if (location.state?.scrollTo === 'help') {
            setTimeout(() => {
                const element = document.getElementById('help-section')
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.classList.add('ring-4', 'ring-[#ff4d2d]/30')
                    setTimeout(() => element.classList.remove('ring-4', 'ring-[#ff4d2d]/30'), 2000)
                }
            }, 300)
        }
    }, [location])

    // Load initial form values when userData/myShopData changes
    useEffect(() => {
        if (userData) {
            setFullName(userData.fullName)
            setMobile(userData.mobile)
        }
    }, [userData])

    useEffect(() => {
        if (myShopData) {
            setShopName(myShopData.name)
            setShopCity(myShopData.city)
            setShopState(myShopData.state)
            setShopAddress(myShopData.address)
            setFrontendImage(myShopData.image)
        }
    }, [myShopData])

    // Fetch user orders to show stats
    const fetchUserOrders = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true })
            setUserOrdersCount(result.data?.length || 0)
        } catch (error) {
            console.log("Error fetching user orders:", error)
        }
    }

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index)
    }

    const handleSendChatMessage = (e) => {
        e.preventDefault()
        if (!chatMessage.trim()) return

        const userMsg = { sender: 'user', text: chatMessage }
        setChatHistory(prev => [...prev, userMsg])
        setChatMessage("")
        setIsTyping(true)

        setTimeout(() => {
            setIsTyping(false)
            const lower = userMsg.text.toLowerCase()
            let botText = "I'm sorry, I didn't quite understand that. You can contact support at shubhamsinghrajput7809@gmail.com or call +91-7011783087."
            if (lower.includes("order") || lower.includes("track")) {
                botText = "You can view your active and past orders in the 'My Orders' section of your profile."
            } else if (lower.includes("cancel") || lower.includes("refund")) {
                botText = "Cancellations are allowed up to 2 hours before the delivery slot. Refunds are processed back to the original payment method in 3-5 business days."
            } else if (lower.includes("offer") || lower.includes("discount") || lower.includes("promo")) {
                botText = "Check out our latest offers on your dashboard: WELCOME50 (50% off first order) or FREEDEL (Free delivery on orders above ₹200)."
            } else if (lower.includes("time") || lower.includes("schedule") || lower.includes("when")) {
                botText = "We deliver meals: Lunch (12:30 PM - 2:30 PM) and Dinner (7:30 PM - 9:30 PM)."
            } else if (lower.includes("hi") || lower.includes("hello")) {
                botText = "Hello! Hope you are doing well. How can Dabba-Drop support you today?"
            }
            setChatHistory(prev => [...prev, { sender: 'bot', text: botText }])
        }, 1200)
    }

    const handleQuickReply = (questionText) => {
        const userMsg = { sender: 'user', text: questionText }
        setChatHistory(prev => [...prev, userMsg])
        setIsTyping(true)

        setTimeout(() => {
            setIsTyping(false)
            let botText = ""
            if (questionText.includes("Track my Dabba")) {
                botText = "To track your Dabba, go to 'My Orders' on your profile or dashboard, find the order, and click 'Track Order'."
            } else if (questionText.includes("Refund policy")) {
                botText = "If you cancel your order at least 2 hours prior to the slot, you get a full refund. Payment gateway refunds take 3-5 working days."
            } else if (questionText.includes("Change address")) {
                botText = "You can update your current delivery location anytime from the 'Customer Dashboard' using the 'Update Current Location' button."
            }
            setChatHistory(prev => [...prev, { sender: 'bot', text: botText }])
        }, 1000)
    }

    // Resolve address from user coordinates
    const resolveUserAddress = async () => {
        if (!userData?.location?.coordinates) return
        try {
            const lon = userData.location.coordinates[0]
            const lat = userData.location.coordinates[1]
            if (lat === 0 && lon === 0) return

            const apiKey = import.meta.env.VITE_GEOAPIKEY
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`)
            const resolved = result?.data?.results[0]?.formatted || result?.data?.results[0]?.address_line2 || "No saved address found"
            setUserAddress(resolved)
        } catch (error) {
            console.log("Error resolving address:", error)
        }
    }

    // Fetch owner shop
    const fetchOwnerShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/shop/get-my`, { withCredentials: true })
            dispatch(setMyShopData(result.data))
        } catch (error) {
            console.log("Error fetching shop:", error)
        }
    }

    // Fetch delivery statistics
    const fetchDeliveryStats = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
            const totalCount = result.data?.reduce((sum, d) => sum + d.count, 0) || 0
            setTodayDeliveriesCount(totalCount)
        } catch (error) {
            console.log("Error fetching today deliveries:", error)
        }
    }

    // Handle Profile Edit Submission
    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage("")
        setSuccessMessage("")
        try {
            const result = await axios.put(`${serverUrl}/api/user/update-profile`, {
                fullName,
                mobile
            }, { withCredentials: true })
            
            dispatch(setUserData(result.data.user))
            setSuccessMessage("Profile updated successfully!")
            setEditProfileOpen(false)
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    // Handle Password Change Submission
    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("New passwords do not match")
            return
        }
        setLoading(true)
        setErrorMessage("")
        setSuccessMessage("")
        try {
            await axios.put(`${serverUrl}/api/user/update-password`, {
                currentPassword,
                newPassword
            }, { withCredentials: true })

            setSuccessMessage("Password changed successfully!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
            setChangePasswordOpen(false)
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to change password")
        } finally {
            setLoading(false)
        }
    }

    // Handle Shop Image input
    const handleShopImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBackendImage(file)
            setFrontendImage(URL.createObjectURL(file))
        }
    }

    // Handle Shop Edit Submission
    const handleUpdateShop = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage("")
        setSuccessMessage("")
        try {
            const formData = new FormData()
            formData.append("name", shopName)
            formData.append("city", shopCity)
            formData.append("state", shopState)
            formData.append("address", shopAddress)
            if (backendImage) {
                formData.append("image", backendImage)
            }

            const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setSuccessMessage("Shop details updated successfully!")
            setEditShopOpen(false)
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update shop details")
        } finally {
            setLoading(false)
        }
    }

    // Geolocation trigger to update user current coordinates
    const triggerUpdateLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser")
            return
        }
        setUpdatingLocation(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            try {
                // Save coordinates to backend
                await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true })
                
                // Get human readable address
                const apiKey = import.meta.env.VITE_GEOAPIKEY
                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`)
                
                const resolvedCity = result?.data?.results[0]?.city || result?.data?.results[0]?.county
                const resolvedState = result?.data?.results[0]?.state
                const resolvedAddress = result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1

                // Update Redux state to sync globally
                dispatch(setUserData({
                    ...userData,
                    location: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    }
                }))
                
                setUserAddress(resolvedAddress)
                setSuccessMessage("Location updated successfully!")
            } catch (error) {
                console.log(error)
                setErrorMessage("Failed to save location details")
            } finally {
                setUpdatingLocation(false)
            }
        }, (error) => {
            console.error(error)
            setErrorMessage("Permission denied or location retrieval failed")
            setUpdatingLocation(false)
        })
    }

    const getRoleBadge = (role) => {
        switch (role) {
            case 'owner':
                return <span className='px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full border border-orange-200'>Restaurant Owner</span>
            case 'deliveryBoy':
                return <span className='px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full border border-blue-200'>Delivery Partner</span>
            default:
                return <span className='px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full border border-green-200'>Customer</span>
        }
    }

    return (
        <div className='w-screen min-h-screen flex flex-col bg-[#fff9f6] text-gray-800'>
            <Nav />

            {/* Content Container */}
            <div className='w-full max-w-6xl mx-auto px-4 pt-28 pb-12 flex-1 flex flex-col gap-6 relative'>
                {/* Back Button */}
                <div className='absolute top-24 left-4 cursor-pointer flex items-center gap-1 text-gray-500 hover:text-[#ff4d2d] transition-colors' onClick={() => navigate("/")}>
                    <IoIosArrowRoundBack size={30} />
                    <span className='text-sm font-medium'>Back to Home</span>
                </div>

                {/* Notifications */}
                {successMessage && (
                    <div className='mt-6 w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm'>
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage("")}><FaTimes /></button>
                    </div>
                )}
                {errorMessage && (
                    <div className='mt-6 w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm'>
                        <span>{errorMessage}</span>
                        <button onClick={() => setErrorMessage("")}><FaTimes /></button>
                    </div>
                )}

                {/* Grid Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8'>
                    
                    {/* Left Column: Profile Card */}
                    <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col items-center text-center gap-6'>
                        <div className='w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff4d2d] to-orange-400 text-white text-4xl flex items-center justify-center font-bold shadow-lg uppercase'>
                            {userData?.fullName?.slice(0, 1)}
                        </div>
                        
                        <div className='flex flex-col gap-1 items-center'>
                            <h2 className='text-xl font-bold text-gray-900'>{userData?.fullName}</h2>
                            <p className='text-gray-500 text-sm'>{userData?.email}</p>
                            <div className='mt-2'>{getRoleBadge(userData?.role)}</div>
                        </div>

                        <div className='w-full border-t border-gray-100 pt-6 flex flex-col gap-4 text-left text-sm'>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <FaEnvelope className='text-[#ff4d2d] w-4 h-4' />
                                <span>{userData?.email}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <FaPhone className='text-[#ff4d2d] w-4 h-4' />
                                <span>{userData?.mobile || "No mobile number provided"}</span>
                            </div>
                        </div>

                        <div className='w-full flex flex-col gap-3 mt-4'>
                            <button 
                                onClick={() => setEditProfileOpen(true)}
                                className='w-full py-2.5 px-4 bg-[#ff4d2d] hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer'
                            >
                                <FaEdit /> Edit Profile
                            </button>
                            <button 
                                onClick={() => setChangePasswordOpen(true)}
                                className='w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer'
                            >
                                <FaLock /> Change Password
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Role-Specific / Functions */}
                    <div className='lg:col-span-2 flex flex-col gap-6'>
                        
                        {/* Dynamic User Profile Dashboard */}
                        {userData?.role === 'user' && (
                            <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col gap-6'>
                                <h3 className='text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2'>
                                    <FaMapMarkerAlt className='text-[#ff4d2d]' /> Customer Dashboard
                                </h3>
                                
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='bg-[#fff9f6] border border-orange-50 p-4 rounded-xl flex flex-col gap-1'>
                                        <span className='text-xs text-gray-400 font-semibold uppercase'>Total Orders</span>
                                        <span className='text-3xl font-bold text-[#ff4d2d]'>{userOrdersCount}</span>
                                    </div>
                                    <div className='bg-[#fff9f6] border border-orange-50 p-4 rounded-xl flex flex-col gap-1'>
                                        <span className='text-xs text-gray-400 font-semibold uppercase'>Account Status</span>
                                        <span className='text-3xl font-bold text-green-600 flex items-center gap-1.5'>
                                            <FaCheckCircle size={24} /> Verified
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2'>
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-sm font-semibold text-gray-700'>Saved Location Address</span>
                                        <p className='text-sm text-gray-500 leading-relaxed'>
                                            {userAddress || "No saved address. Please update your current location."}
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={triggerUpdateLocation}
                                        disabled={updatingLocation}
                                        className='w-full sm:w-auto self-start mt-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer'
                                    >
                                        {updatingLocation ? (
                                            <>
                                                <ClipLoader size={18} color='white' />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaMapMarkerAlt />
                                                <span>Update Current Location</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Offers Section */}
                        {userData?.role === 'user' && (
                            <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-lg animate-fade-in'>
                                <h3 className='text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2'>
                                    <FaGift className='text-[#ff4d2d]' /> Exclusive Offers for You
                                </h3>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {/* Offer Card 1 */}
                                    <div className='bg-gradient-to-br from-orange-50/50 to-[#fff9f6] border border-orange-100 p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#ff4d2d] transition-all duration-300 shadow-sm'>
                                        <div className='absolute -right-4 -top-4 w-12 h-12 bg-[#ff4d2d]/10 rounded-full group-hover:scale-150 transition-all duration-300'></div>
                                        <div>
                                            <span className='px-2.5 py-1 bg-[#ff4d2d]/15 text-[#ff4d2d] font-bold text-xs rounded-full'>WELCOME OFFER</span>
                                            <h4 className='text-sm font-bold text-gray-800 mt-2'>Get 50% Off on First Order</h4>
                                            <p className='text-xs text-gray-500 mt-1'>Use this coupon to claim 50% off up to ₹150 on your very first order.</p>
                                        </div>
                                        <div className='flex items-center justify-between border-t border-dashed border-orange-100 pt-3 mt-1'>
                                            <span className='font-mono font-bold text-gray-700 bg-white border px-3 py-1 rounded text-sm select-all'>WELCOME50</span>
                                            <button 
                                                onClick={() => handleCopyCode('WELCOME50')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                                                    copiedCode === 'WELCOME50' ? 'bg-green-500 text-white' : 'bg-[#ff4d2d] hover:bg-orange-600 text-white'
                                                }`}
                                            >
                                                {copiedCode === 'WELCOME50' ? (
                                                    <>
                                                        <FaCheck /> Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCopy /> Copy Code
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Offer Card 2 */}
                                    <div className='bg-gradient-to-br from-orange-50/50 to-[#fff9f6] border border-orange-100 p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#ff4d2d] transition-all duration-300 shadow-sm'>
                                        <div className='absolute -right-4 -top-4 w-12 h-12 bg-blue-500/10 rounded-full group-hover:scale-150 transition-all duration-300'></div>
                                        <div>
                                            <span className='px-2.5 py-1 bg-blue-100 text-blue-600 font-bold text-xs rounded-full'>DELIVERY OFFER</span>
                                            <h4 className='text-sm font-bold text-gray-800 mt-2'>Free Delivery above ₹200</h4>
                                            <p className='text-xs text-gray-500 mt-1'>Free prompt hot delivery to your doorstep on orders of ₹200 and above.</p>
                                        </div>
                                        <div className='flex items-center justify-between border-t border-dashed border-orange-100 pt-3 mt-1'>
                                            <span className='font-mono font-bold text-gray-700 bg-white border px-3 py-1 rounded text-sm select-all'>FREEDEL</span>
                                            <button 
                                                onClick={() => handleCopyCode('FREEDEL')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                                                    copiedCode === 'FREEDEL' ? 'bg-green-500 text-white' : 'bg-[#ff4d2d] hover:bg-orange-600 text-white'
                                                }`}
                                            >
                                                {copiedCode === 'FREEDEL' ? (
                                                    <>
                                                        <FaCheck /> Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCopy /> Copy Code
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interactive Help & Support / FAQ Section */}
                        {userData?.role === 'user' && (
                            <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-lg animate-fade-in'>
                                <h3 className='text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2'>
                                    <FaQuestionCircle className='text-[#ff4d2d]' /> Help & Support
                                </h3>

                                <div className='flex flex-col gap-3'>
                                    {[
                                        {
                                            q: "How do I track my Dabba delivery?",
                                            a: "You can track your order in real-time under the 'My Orders' tab on your profile or directly through the tracking link sent to your mobile."
                                        },
                                        {
                                            q: "Can I customize my meals?",
                                            a: "Yes! While ordering, you can add custom preferences or allergens notes for each item in your cart."
                                        },
                                        {
                                            q: "What is the delivery schedule?",
                                            a: "We deliver breakfast from 8 AM - 10 AM, lunch from 12:30 PM - 2:30 PM, and dinner from 7:30 PM - 9:30 PM."
                                        },
                                        {
                                            q: "What if my payment failed but money got debited?",
                                            a: "Any payment failure debits are auto-reversed by your bank. The refund will show in your original payment mode within 3-5 business days."
                                        },
                                        {
                                            q: "Are the containers eco-friendly and reusable?",
                                            a: "Yes, Dabba-Drop uses food-grade reusable stainless steel containers. We collect the previous clean empty container when delivering your next delicious meal."
                                        },
                                        {
                                            q: "How do I cancel or modify my active order?",
                                            a: "You can cancel or change delivery address for any active order up to 2 hours before the delivery slot starts by chatting with support or updating from dashboard."
                                        }
                                    ].map((faq, idx) => (
                                        <div key={idx} className='border-b border-gray-100 pb-3 last:border-0 last:pb-0'>
                                            <button 
                                                onClick={() => toggleFaq(idx)}
                                                className='w-full flex justify-between items-center text-left py-1.5 text-sm font-semibold text-gray-700 hover:text-[#ff4d2d] transition-colors focus:outline-none cursor-pointer'
                                            >
                                                <span>{faq.q}</span>
                                                {activeFaq === idx ? <FaChevronUp className='text-[#ff4d2d]' /> : <FaChevronDown className='text-gray-400' />}
                                            </button>
                                            <div className={`mt-1.5 text-xs text-gray-500 overflow-hidden transition-all duration-300 ${
                                                activeFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                                <p className='bg-gray-50 p-3 rounded-lg leading-relaxed border border-gray-100'>{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-orange-50/50 to-[#fff9f6] border border-orange-100 p-4 rounded-xl'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 rounded-full bg-[#ff4d2d]/10 flex items-center justify-center text-[#ff4d2d] flex-shrink-0'>
                                            <FaComments size={20} />
                                        </div>
                                        <div>
                                            <h4 className='text-sm font-bold text-gray-800'>Need direct support?</h4>
                                            <p className='text-xs text-gray-500'>Chat with our virtual customer support assistant instantly.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setChatOpen(true)}
                                        className='w-full sm:w-auto px-5 py-2.5 bg-[#ff4d2d] hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-97'
                                    >
                                        <FaComments /> Start Live Chat
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Owner Shop Dashboard */}
                        {userData?.role === 'owner' && (
                            <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col gap-6'>
                                <div className='flex justify-between items-center border-b pb-3'>
                                    <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
                                        <FaStore className='text-[#ff4d2d]' /> Shop Profile
                                    </h3>
                                    
                                    <button 
                                        onClick={() => setEditShopOpen(true)}
                                        className='px-4 py-1.5 bg-[#ff4d2d]/10 hover:bg-[#ff4d2d]/25 text-[#ff4d2d] rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer'
                                    >
                                        <FaEdit /> Update Shop Info
                                    </button>
                                </div>

                                {myShopData ? (
                                    <div className='flex flex-col md:flex-row gap-6 items-start md:items-center'>
                                        <div className='w-full md:w-48 h-36 rounded-xl overflow-hidden border border-gray-200 shadow-inner flex-shrink-0'>
                                            <img src={myShopData.image} alt={myShopData.name} className='w-full h-full object-cover' />
                                        </div>
                                        
                                        <div className='flex-1 flex flex-col gap-3 text-sm'>
                                            <div>
                                                <span className='text-xs text-gray-400 font-semibold uppercase'>Shop Name</span>
                                                <p className='text-lg font-bold text-gray-900'>{myShopData.name}</p>
                                            </div>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div>
                                                    <span className='text-xs text-gray-400 font-semibold uppercase'>City</span>
                                                    <p className='font-medium text-gray-800'>{myShopData.city}</p>
                                                </div>
                                                <div>
                                                    <span className='text-xs text-gray-400 font-semibold uppercase'>State</span>
                                                    <p className='font-medium text-gray-800'>{myShopData.state}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className='text-xs text-gray-400 font-semibold uppercase'>Street Address</span>
                                                <p className='font-medium text-gray-800 leading-relaxed'>{myShopData.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='bg-[#fff9f6] border border-dashed border-orange-200 rounded-xl p-8 text-center flex flex-col items-center gap-3'>
                                        <FaStore className='text-orange-300 w-12 h-12' />
                                        <div>
                                            <p className='font-bold text-gray-800'>No Shop Registered</p>
                                            <p className='text-xs text-gray-400 mt-0.5'>You haven't setup your shop yet.</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate("/create-edit-shop")}
                                            className='mt-2 px-5 py-2 bg-[#ff4d2d] hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow-md cursor-pointer'
                                        >
                                            Register Your Shop
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dynamic Delivery Dashboard */}
                        {userData?.role === 'deliveryBoy' && (
                            <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col gap-6'>
                                <h3 className='text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2'>
                                    <FaTruck className='text-[#ff4d2d]' /> Delivery Partner Dashboard
                                </h3>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='bg-[#fff9f6] border border-orange-50 p-4 rounded-xl flex items-center gap-4'>
                                        <div className='p-3 rounded-full bg-green-100 text-green-600'>
                                            <FaCheckCircle size={22} />
                                        </div>
                                        <div className='flex flex-col gap-0.5'>
                                            <span className='text-xs text-gray-400 font-semibold uppercase'>Today's Deliveries</span>
                                            <span className='text-2xl font-bold text-gray-800'>{todayDeliveriesCount}</span>
                                        </div>
                                    </div>
                                    
                                    <div className='bg-[#fff9f6] border border-orange-50 p-4 rounded-xl flex items-center gap-4'>
                                        <div className='p-3 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                                            <FaWallet size={22} />
                                        </div>
                                        <div className='flex flex-col gap-0.5'>
                                            <span className='text-xs text-gray-400 font-semibold uppercase'>Today's Earnings</span>
                                            <span className='text-2xl font-bold text-green-600'>₹{todayDeliveriesCount * 50}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col gap-3 text-sm'>
                                    <div className='flex flex-col gap-0.5'>
                                        <span className='font-semibold text-gray-700'>Live Duty Coordinates</span>
                                        <p className='text-gray-500 font-mono'>
                                            Lat: {userData.location?.coordinates[1] || "0.00"}, Lon: {userData.location?.coordinates[0] || "0.00"}
                                        </p>
                                    </div>
                                    <p className='text-xs text-gray-400 leading-relaxed'>
                                        Your duty status and coordinates are synced automatically with the central routing server to assign orders efficiently. Make sure GPS permissions are enabled on your browser.
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* MODALS */}
            
            {/* Modal: Edit Profile */}
            {editProfileOpen && (
                <div className='fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm'>
                    <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl border border-orange-50 overflow-hidden animate-fade-in'>
                        <div className='px-6 py-4 bg-[#ff4d2d] text-white flex justify-between items-center'>
                            <h3 className='font-bold text-lg flex items-center gap-2'><FaUser /> Edit Profile</h3>
                            <button onClick={() => setEditProfileOpen(false)} className='text-white hover:text-orange-200 transition-colors'><FaTimes size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className='p-6 flex flex-col gap-4'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='Full Name'
                                />
                            </div>
                            
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Mobile Number</label>
                                <input 
                                    type="text" 
                                    required
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='Mobile Number'
                                />
                            </div>

                            <button 
                                type='submit' 
                                disabled={loading}
                                className='mt-3 w-full py-2.5 bg-[#ff4d2d] hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md'
                            >
                                {loading ? <ClipLoader size={18} color='white' /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Change Password */}
            {changePasswordOpen && (
                <div className='fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm'>
                    <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl border border-orange-50 overflow-hidden'>
                        <div className='px-6 py-4 bg-[#ff4d2d] text-white flex justify-between items-center'>
                            <h3 className='font-bold text-lg flex items-center gap-2'><FaLock /> Change Password</h3>
                            <button onClick={() => setChangePasswordOpen(false)} className='text-white hover:text-orange-200 transition-colors'><FaTimes size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdatePassword} className='p-6 flex flex-col gap-4'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Current Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='Current Password'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='At least 6 characters'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Confirm New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='Confirm New Password'
                                />
                            </div>

                            <button 
                                type='submit' 
                                disabled={loading}
                                className='mt-3 w-full py-2.5 bg-[#ff4d2d] hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md'
                            >
                                {loading ? <ClipLoader size={18} color='white' /> : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Shop (For Owner) */}
            {editShopOpen && (
                <div className='fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm'>
                    <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-orange-50 overflow-hidden'>
                        <div className='px-6 py-4 bg-[#ff4d2d] text-white flex justify-between items-center'>
                            <h3 className='font-bold text-lg flex items-center gap-2'><FaStore /> Edit Shop Info</h3>
                            <button onClick={() => setEditShopOpen(false)} className='text-white hover:text-orange-200 transition-colors'><FaTimes size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdateShop} className='p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Shop Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='Shop Name'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Shop Image</label>
                                <input 
                                    type="file" 
                                    accept='image/*' 
                                    onChange={handleShopImageChange}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                />
                                {frontendImage && (
                                    <div className='mt-3 h-28 w-full border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center'>
                                        <img src={frontendImage} alt="Preview" className='h-full object-contain' />
                                    </div>
                                )}
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>City</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={shopCity}
                                        onChange={(e) => setShopCity(e.target.value)}
                                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                        placeholder='City'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>State</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={shopState}
                                        onChange={(e) => setShopState(e.target.value)}
                                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                        placeholder='State'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1.5'>Street Address</label>
                                <input 
                                    type="text" 
                                    required
                                    value={shopAddress}
                                    onChange={(e) => setShopAddress(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    placeholder='Address'
                                />
                            </div>

                            <button 
                                type='submit' 
                                disabled={loading}
                                className='mt-3 w-full py-2.5 bg-[#ff4d2d] hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md'
                            >
                                {loading ? <ClipLoader size={18} color='white' /> : "Save Shop Details"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Interactive Live Chat Drawer / Modal */}
            {chatOpen && (
                <div className='fixed bottom-5 right-5 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden z-[9999] flex flex-col h-[450px] transition-all duration-300 animate-slide-up'>
                    {/* Header */}
                    <div className='bg-[#ff4d2d] text-white p-4 flex justify-between items-center shadow-md'>
                        <div className='flex items-center gap-2.5'>
                            <div className='w-2 h-2 bg-green-400 rounded-full animate-ping'></div>
                            <div>
                                <h4 className='font-bold text-sm leading-tight'>Dabba-Drop Support</h4>
                                <span className='text-[10px] text-orange-200'>Active Agent Online</span>
                            </div>
                        </div>
                        <button onClick={() => setChatOpen(false)} className='text-white hover:text-orange-200 transition-colors focus:outline-none cursor-pointer'>
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/50'>
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-[#ff4d2d] text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className='flex justify-start'>
                                <div className='bg-white text-gray-500 border border-gray-100 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-sm'>
                                    <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'></span>
                                    <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100'></span>
                                    <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200'></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Replies */}
                    <div className='px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-none'>
                        {["Track my Dabba", "Refund policy", "Change address"].map((reply, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuickReply(reply)}
                                className='text-[10px] whitespace-nowrap bg-orange-50 hover:bg-[#ff4d2d]/10 text-[#ff4d2d] border border-orange-100 px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer font-sans'
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChatMessage} className='p-3 bg-white border-t border-gray-100 flex gap-2'>
                        <input 
                            type="text" 
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder='Type your message here...'
                            className='flex-1 px-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#ff4d2d] bg-gray-50'
                        />
                        <button 
                            type='submit'
                            className='bg-[#ff4d2d] hover:bg-orange-600 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-md'
                        >
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            )}

        </div>
    )
}

export default Profile

import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'

function useGetMyOrders() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
  const fetchOrders=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true})
            console.log('My Orders API Response:', result.data)
            console.log('My Orders API Response type:', typeof result.data)
            console.log('My Orders API Response length:', result.data?.length)
            dispatch(setMyOrders(result.data))
   


    } catch (error) {
        console.log('Error fetching my orders:', error?.response?.data || error.message)
        // Set to empty array on error
        dispatch(setMyOrders([]))
    }
}
  if(userData) {
    console.log('Fetching orders for user:', userData)
    fetchOrders()
  }


  
  },[userData])
}

export default useGetMyOrders

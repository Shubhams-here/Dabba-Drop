import express from "express"
import { getCurrentUser, updateUserLocation, updateUserProfile, updateUserPassword } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"


const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post('/update-location',isAuth,updateUserLocation)
userRouter.put('/update-profile',isAuth,updateUserProfile)
userRouter.put('/update-password',isAuth,updateUserPassword)
export default userRouter
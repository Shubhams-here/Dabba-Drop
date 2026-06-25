import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const getCurrentUser=async (req,res) => {
    try {
        const userId=req.userId
        if(!userId){
            return res.status(400).json({message:"userId is not found"})
        }
        const user=await User.findById(userId)
        if(!user){
               return res.status(400).json({message:"user is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`get current user error ${error}`})
    }
}

export const updateUserLocation=async (req,res) => {
    try {
        const {lat,lon}=req.body
        const user=await User.findByIdAndUpdate(req.userId,{
            location:{
                type:'Point',
                coordinates:[lon,lat]
            }
        },{new:true})
         if(!user){
               return res.status(400).json({message:"user is not found"})
        }
        
        return res.status(200).json({message:'location updated'})
    } catch (error) {
           return res.status(500).json({message:`update location user error ${error}`})
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const fullName = req.body.fullName?.trim()
        const mobile = req.body.mobile?.trim()

        if (!fullName || !mobile) {
            return res.status(400).json({ message: "Full Name and Mobile are required" })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "Mobile number must be at least 10 digits" })
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            fullName,
            mobile
        }, { new: true })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ message: "Profile updated successfully", user })
    } catch (error) {
        return res.status(500).json({ message: `Update profile error ${error}` })
    }
}

export const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" })
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" })
        }

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect current password" })
            }
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        return res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Update password error ${error}` })
    }
}



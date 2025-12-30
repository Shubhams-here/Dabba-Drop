import express from 'express'
import {
    submitContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
} from '../controllers/contact.controllers.js'
import isAuth from '../middlewares/isAuth.js'

const router = express.Router()

// Public routes
router.post('/submit', submitContact)

// Protected routes (admin only)
router.get('/', isAuth, getAllContacts)
router.get('/:id', isAuth, getContactById)
router.put('/:id', isAuth, updateContact)
router.delete('/:id', isAuth, deleteContact)

export default router
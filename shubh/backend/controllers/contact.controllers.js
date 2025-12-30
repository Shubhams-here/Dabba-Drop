import Contact from '../models/contact.model.js'
import nodemailer from 'nodemailer'

// Create contact message
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            })
        }

        // Create new contact message
        const contactMessage = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            subject: subject.trim(),
            message: message.trim()
        })

        // Save to database
        await contactMessage.save()

        // Send confirmation email to user
        try {
            await sendConfirmationEmail(contactMessage)
        } catch (emailError) {
            console.log('Email sending failed:', emailError.message)
            // Don't fail the request if email fails
        }

        // Send notification email to admin
        try {
            await sendAdminNotification(contactMessage)
        } catch (emailError) {
            console.log('Admin notification email failed:', emailError.message)
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            data: {
                id: contactMessage._id,
                status: contactMessage.status
            }
        })

    } catch (error) {
        console.error('Contact submission error:', error)

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            })
        }

        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        })
    }
}

// Get all contact messages (admin only)
const getAllContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const status = req.query.status
        const priority = req.query.priority

        const query = {}
        if (status) query.status = status
        if (priority) query.priority = priority

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedTo', 'fullName email')

        const total = await Contact.countDocuments(query)

        res.json({
            success: true,
            data: {
                contacts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalContacts: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            }
        })

    } catch (error) {
        console.error('Get contacts error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact messages'
        })
    }
}

// Get single contact message
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('assignedTo', 'fullName email')

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            })
        }

        res.json({
            success: true,
            data: contact
        })

    } catch (error) {
        console.error('Get contact error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact message'
        })
    }
}

// Update contact message status/response
const updateContact = async (req, res) => {
    try {
        const { status, priority, category, response, assignedTo } = req.body

        const updateData = {}
        if (status) updateData.status = status
        if (priority) updateData.priority = priority
        if (category) updateData.category = category
        if (response) {
            updateData.response = response
            updateData.respondedAt = new Date()
        }
        if (assignedTo) updateData.assignedTo = assignedTo

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'fullName email')

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            })
        }

        // Send response email to user if response is provided
        if (response) {
            try {
                await sendResponseEmail(contact)
            } catch (emailError) {
                console.log('Response email failed:', emailError.message)
            }
        }

        res.json({
            success: true,
            message: 'Contact message updated successfully',
            data: contact
        })

    } catch (error) {
        console.error('Update contact error:', error)

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            })
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update contact message'
        })
    }
}

// Delete contact message
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id)

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            })
        }

        res.json({
            success: true,
            message: 'Contact message deleted successfully'
        })

    } catch (error) {
        console.error('Delete contact error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact message'
        })
    }
}

// Email functions
const sendConfirmationEmail = async (contact) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'Thank you for contacting DabbaDrop',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff4d2d;">Thank you for reaching out to DabbaDrop!</h2>
                <p>Hi ${contact.name},</p>
                <p>We've received your message regarding "${contact.subject}" and our team will get back to you within 24 hours.</p>
                <p><strong>Your message:</strong></p>
                <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${contact.message}</p>
                <p>If you have any additional information or urgent concerns, please don't hesitate to reply to this email.</p>
                <p>Best regards,<br>The DabbaDrop Team</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

const sendAdminNotification = async (contact) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${contact.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff4d2d;">New Contact Form Submission</h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #ff4d2d;">${contact.message}</p>
                    <p><strong>Submitted:</strong> ${contact.createdAt.toLocaleString()}</p>
                </div>
                <p>Please respond to this inquiry as soon as possible.</p>
                <p><a href="${process.env.FRONTEND_URL}/admin/contacts/${contact._id}" style="background-color: #ff4d2d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

const sendResponseEmail = async (contact) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: `Re: ${contact.subject} - DabbaDrop Support`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff4d2d;">Response from DabbaDrop Support</h2>
                <p>Hi ${contact.name},</p>
                <p>Thank you for contacting DabbaDrop. Here's our response to your inquiry:</p>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff4d2d;">
                    <p><strong>Your original message:</strong></p>
                    <p style="font-style: italic;">${contact.message}</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
                    <p><strong>Our response:</strong></p>
                    <p>${contact.response}</p>
                </div>
                <p>If you have any further questions or need additional assistance, please don't hesitate to reply to this email.</p>
                <p>Best regards,<br>The DabbaDrop Support Team</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">
                    This email was sent in response to your contact form submission.
                </p>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

export {
    submitContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
}
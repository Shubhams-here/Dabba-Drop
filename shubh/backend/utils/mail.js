import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail=async (to,otp) => {
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject:"Reset Your Password",
        html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}


export const sendDeliveryOtpMail=async (user,otp) => {
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:user.email,
        subject:"Delivery OTP",
        html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}

export const sendDeliveryConfirmationMail = async (user, orderDetails) => {
    const itemsList = orderDetails.shopOrderItems.map(item =>
        `<li>${item.name} - Quantity: ${item.quantity} - ₹${item.price * item.quantity}</li>`
    ).join('');

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Order Has Been Delivered Successfully! 🎉",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #ff4d2d; text-align: center;">Order Delivered Successfully! 🎉</h2>
                <p>Hi ${user.fullName},</p>
                <p>Great news! Your order has been successfully delivered to your doorstep.</p>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
                    <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                    <p><strong>Delivered At:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Items Delivered:</strong></p>
                    <ul style="background-color: white; padding: 10px; border-radius: 3px;">
                        ${itemsList}
                    </ul>
                    <p><strong>Total Amount:</strong> ₹${orderDetails.subtotal}</p>
                </div>

                <p>We hope you enjoyed your meal! Your feedback is valuable to us.</p>
                <p>If you have any questions or concerns about your order, please don't hesitate to contact us.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/my-orders"
                       style="background-color: #ff4d2d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        View Your Orders
                    </a>
                </div>

                <p style="text-align: center; color: #666; font-size: 12px;">
                    Thank you for choosing DabbaDrop! 🍽️
                </p>
            </div>
        `
    })
}

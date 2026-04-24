import Razorpay from "razorpay";
import dotenv from 'dotenv'

dotenv.config()

export const razorpay= new Razorpay({
    key_id: process.env.RAZORPAT_KEY_ID!,
    key_secret: process.env.RAZORPAT_KEY_ID!,

})
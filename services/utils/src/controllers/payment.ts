import axios from "axios";
import { Request, Response } from "express";

export const createRazorpayOrder = async(req:Request, res:Response)=>{
    const {orderId} = req.body;
    const {data} = await axios.get(`${process.env.RESTAURANT_SERVICE}`)
}
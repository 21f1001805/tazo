import "dotenv/config";
import express  from "express";
import connectDb from "./config/db.js";
import dotenv from 'dotenv';
import restaurantRoutes from "./routes/restaurant.js"

import cors from 'cors';
import itemRoutes from "./routes/menuitem.js"
import cartRoutes from './routes/cart.js'
import addressRoutes from "./routes/address.js";
import orderRoutes from './routes/order.js'

const app = express();
const PORT = process.env.PORT || 5001;
dotenv.config()
app.use(cors());

app.use(express.json());
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/item", itemRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, ()=>{
    console.log(`Restaurant service is running on port ${PORT}`);
    connectDb()
})

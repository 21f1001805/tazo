import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import dotenv from 'dotenv';
import restaurantRoutes from "./routes/restaurant.js";
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5001;
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/restaurant", restaurantRoutes);
app.listen(PORT, () => {
    console.log(`Restaurant service is running on port ${PORT}`);
    connectDb();
});

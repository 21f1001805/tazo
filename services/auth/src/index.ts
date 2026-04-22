import "dotenv/config";
import  express  from "express";
import dotenv from 'dotenv';
import connectDb from "./config/db.js";
import authRoute from './routes/auth.js'
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json())
dotenv.config()

app.use("/api/auth", authRoute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Auth service is running on port ${PORT}`);
    connectDb()
})

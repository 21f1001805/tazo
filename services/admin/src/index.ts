import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import cors from "cors";
import { globalApiThrottle } from "./middlewares/tokenBucket.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use("/api", globalApiThrottle);
app.use("/api/v1", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Admin Service is running on port ${process.env.PORT}`);
});

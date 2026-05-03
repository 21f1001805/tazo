import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { initSocket } from "./socket.js";
import internalRoute from "./routes/internal.js";
import { globalApiThrottle } from "./middlewares/tokenBucket.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use("/api", globalApiThrottle);

app.use("/api/v1/internal", internalRoute);

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Realtime service is running port ${process.env.PORT}`);
});

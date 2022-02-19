import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import AuthRouter from "./routes/authRoute.js";

const server = express();
const PORT = process.env.PORT || 4000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(AuthRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => console.log("server running on port", PORT));
  })
  .catch((e) => console.log(e));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import AuthRouter from "./routes/authRoute.js";
import PatientRouter from "./routes/patientRoute.js";
import DoctorRouter from "./routes/doctorRoute.js";
import morgan from "morgan";

export async function startServer({
  PORT = process.env.PORT,
  DB_URL = process.env.MONGO_URL,
} = {}) {
  const server = express();

  server.use(morgan("tiny"));
  server.use(compression());
  server.use(helmet());
  server.use(mongoSanitize());
  server.use(
    cors({
      credentials: true,
      origin: process.env.HOST_URL,
    })
  );
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  //routes
  server.use("/health-check", (req, res) => {
    res.send("server online");
  });
  server.use(AuthRouter);
  server.use("/patient", PatientRouter);
  server.use("/doctor", DoctorRouter);

  try {
    await mongoose.connect(DB_URL);
    server.listen(PORT, () => console.log("server running on port", PORT));
  } catch (e) {
    return console.log(e);
  }
}

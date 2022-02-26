import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import AuthRouter from "./routes/authRoute.js";
import PatientRouter from "./routes/patientRoute.js";
import DoctorRouter from "./routes/doctorRoute.js";

const server = express();
const PORT = process.env.PORT || 4000;

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

server.use("/health-check", (req, res) => {
  res.send("server online");
});
//routes
server.use(AuthRouter);
server.use("/patient", PatientRouter);
server.use("/doctor", DoctorRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => console.log("server running on port", PORT));
  })
  .catch((e) => console.log(e));

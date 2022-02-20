import express from "express";
import {
  getDoctorAppointments,
  getDoctorPatients,
} from "../controllers/doctor.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/appointments", verifyToken, getDoctorAppointments);
router.get("/patients", verifyToken, getDoctorPatients);

export default router;

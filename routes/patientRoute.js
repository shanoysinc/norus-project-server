import express from "express";
import {
  createAppointment,
  deletePatient,
  getAppointments,
} from "../controllers/patient.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.delete("/", verifyToken, deletePatient);

router.get("/appointment", verifyToken, getAppointments);
router.post("/appointment", verifyToken, createAppointment);

export default router;

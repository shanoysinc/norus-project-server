import express from "express";
import { Roles } from "../const/index.js";
import {
  getDoctorAppointments,
  getDoctorPatients,
} from "../controllers/doctor.controller.js";
import { authRole } from "../middleware/authRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get(
  "/appointments",
  verifyToken,
  authRole(Roles.DOCTOR),
  getDoctorAppointments
);
router.get("/patients", verifyToken, authRole(Roles.DOCTOR), getDoctorPatients);

export default router;

import express from "express";
import { Roles } from "../const/index.js";
import {
  getDoctorAppointments,
  getDoctorPatients,
  getDoctor,
  updateDoctorAppointments,
} from "../controllers/doctor.controller.js";
import { authRole } from "../middleware/authRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const doctorRole = Roles.DOCTOR;
router.get("/", verifyToken, authRole(doctorRole), getDoctor);
router.get(
  "/appointments",
  verifyToken,
  authRole(doctorRole),
  getDoctorAppointments
);

router.patch(
  "/appointments",
  verifyToken,
  authRole(doctorRole),
  updateDoctorAppointments
);
router.get("/patients", verifyToken, authRole(doctorRole), getDoctorPatients);

export default router;

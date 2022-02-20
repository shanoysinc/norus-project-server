import express from "express";
import {
  createAppointment,
  deletePatient,
  getAppointments,
  editProfile,
} from "../controllers/patient.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authRole } from "../middleware/authRole.js";
import { Roles } from "../const/index.js";

const router = express.Router();
const patientRole = Roles.PATIENT;

router.put("/", verifyToken, authRole(patientRole), editProfile);
router.delete("/", verifyToken, authRole(patientRole), deletePatient);

router.get("/appointment", verifyToken, authRole(patientRole), getAppointments);
router.post(
  "/appointment",
  verifyToken,
  authRole(patientRole),
  createAppointment
);

export default router;

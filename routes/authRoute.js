import express from "express";
import { Roles } from "../const/index.js";
import {
  doctorLogin,
  patientLogin,
  patientSignup,
  patientLogout,
  doctorLogout,
} from "../controllers/auth.controller.js";
import { authRole } from "../middleware/authRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

const doctorRole = Roles.DOCTOR;
const patientRole = Roles.PATIENT;

router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);

router.post(
  "/patient/logout",
  verifyToken,
  authRole(patientRole),
  patientLogout
);

router.post("/doctor/login", doctorLogin);
router.post("/doctor/logout", authRole(doctorRole), doctorLogout);

export default router;

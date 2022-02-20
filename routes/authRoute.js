import express from "express";
import {
  doctorLogin,
  patientLogin,
  patientSignup,
  patientLogout,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);
router.post("/patient/logout", verifyToken, patientLogout);

router.post("/doctor/login", doctorLogin);

export default router;

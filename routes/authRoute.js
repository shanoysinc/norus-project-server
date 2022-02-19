import express from "express";
import {
  doctorLogin,
  patientLogin,
  patientSignup,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);

router.post("/doctor/login", doctorLogin);

export default router;

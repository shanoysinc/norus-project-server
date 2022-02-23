import express from "express";
import {
  doctorLogin,
  patientLogin,
  patientSignup,
  userLogout,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);

router.post("/user/logout", verifyToken, userLogout);

router.post("/doctor/login", doctorLogin);

export default router;

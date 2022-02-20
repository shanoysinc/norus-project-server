import express from "express";
import { Roles } from "../const/index.js";
import {
  doctorLogin,
  patientLogin,
  patientSignup,
  patientLogout,
} from "../controllers/auth.controller.js";
import { authRole } from "../middleware/authRole.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);

router.post(
  "/patient/logout",
  verifyToken,
  authRole(Roles.PATIENT),
  patientLogout
);

router.post("/doctor/login", authRole(Roles.DOCTOR), doctorLogin);

export default router;

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

router.put("/", verifyToken, authRole(Roles.PATIENT), editProfile);
router.delete("/", verifyToken, authRole(Roles.PATIENT), deletePatient);

router.get(
  "/appointment",
  verifyToken,
  authRole(Roles.PATIENT),
  getAppointments
);
router.post(
  "/appointment",
  verifyToken,
  authRole(Roles.PATIENT),
  createAppointment
);

export default router;

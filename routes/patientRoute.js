import express from "express";
import { deletePatient } from "../controllers/patient.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/");
router.delete("/", verifyToken, deletePatient);

export default router;

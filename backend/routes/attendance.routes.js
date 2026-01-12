import express from "express";
import {
  getTodayAttendance,
  manualAttendance,
  scanAttendance,
} from "../controllers/attendance.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/today", protect, getTodayAttendance);
router.post("/manual", protect, manualAttendance);
router.post("/scan", protect, scanAttendance);

export default router;

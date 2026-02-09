import express from "express";
import {
  getTodayAttendance,
  manualAttendance,
  scanAttendance,
  updateScanAction,
  getDashboardStats,
} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/today", protect, getTodayAttendance);
router.post("/manual", protect, manualAttendance);
router.get("/dashboard", protect, getDashboardStats);
router.post("/scan", protect, scanAttendance);
router.post("/action", protect, updateScanAction);

export default router;

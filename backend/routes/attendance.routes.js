import express from "express";
import {
  getTodayAttendance,
  manualAttendance,
  scanAttendance,
  updateScanAction,
  getDashboardStats,
  updateAvailability,
  getAllScans,
} from "../controllers/attendance.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/today", protect, getTodayAttendance);
router.post("/manual", protect, manualAttendance);
router.post("/scan", protect, scanAttendance);
router.put("/update-action", protect, updateScanAction);
router.get("/dashboard", protect, getDashboardStats);
router.put("/availability", protect, updateAvailability);
router.get("/all-scans", protect, getAllScans);

export default router;

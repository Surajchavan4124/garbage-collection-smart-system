import express from "express";
import {
  sendOtp,
  verifyOtpAndLogin,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkSession } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndLogin);
router.get("/me", protect, checkSession);

export default router;

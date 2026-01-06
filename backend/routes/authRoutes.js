import express from "express";
import {
  sendOtp,
  verifyOtpAndLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndLogin);

export default router;

import express from "express";
import {
  sendOtp,
  verifyOtpAndLogin,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkSession } from "../controllers/auth.controller.js";
import {
  getProfile,
  updateProfile,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndLogin);
router.post("/register", register);
router.get("/me", protect, checkSession);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});


router.get("/me", protect, checkSession);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;

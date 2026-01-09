import User from "../models/User.model.js";
import { generateOTP, verifyOTP } from "../utils/otpService.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Send OTP
 */
export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({
      message: "Mobile number required",
      success: false,
    });
  }

  generateOTP(mobile);

  return res.status(200).json({
    message: "OTP sent (mocked)",
    success: true,
  });
};

/**
 * Verify OTP & Login
 */
export const verifyOtpAndLogin = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!verifyOTP(mobile, otp)) {
    return res.status(401).json({
      message: "Invalid OTP",
      success: false,
    });
  }

  const user = await User.findOne({ mobile });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    panchayatId: user.panchayatId,
  });

  // ✅ SET COOKIE ONCE
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // ✅ SEND RESPONSE ONCE
  return res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      panchayatId: user.panchayatId,
    },
  });
};

export const logout = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      message: "Logout successful",
      success: true,
    });
};

export const checkSession = (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      role: req.user.role,
      panchayatId: req.user.panchayatId,
    },
  });
};


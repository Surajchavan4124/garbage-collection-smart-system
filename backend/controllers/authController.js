import User from "../models/User.model.js";
import { generateOTP, verifyOTP } from "../utils/otpService.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Send OTP
 */
export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number required" });
  }

  generateOTP(mobile);

  res.json({ message: "OTP sent (mocked)" });
};

/**
 * Verify OTP & Login
 */
export const verifyOtpAndLogin = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!verifyOTP(mobile, otp)) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  const user = await User.findOne({ mobile });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    panchayatId: user.panchayatId,
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      panchayatId: user.panchayatId,
    },
  });
};

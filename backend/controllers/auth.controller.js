import User from "../models/User.model.js";
import Panchayat from "../models/Panchayat.model.js";
import { generateOTP, verifyOTP } from "../utils/otpService.js";
import { generateToken } from "../utils/jwt.js";
import Subscription from "../models/subscription.model.js";

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
 * OPTION 2: Fallback to Panchayat if User not found
 */
export const verifyOtpAndLogin = async (req, res) => {
  const { mobile, otp } = req.body;

  // 1️⃣ Verify OTP
  if (!verifyOTP(mobile, otp)) {
    return res.status(401).json({
      message: "Invalid OTP",
      success: false,
    });
  }

  // 2️⃣ Try User login
  let user = await User.findOne({ mobile });

  // 3️⃣ Fallback → Panchayat ADMIN
  if (!user) {
    const panchayat = await Panchayat.findOne({
      contactPhone: mobile,
      status: "active",
    });

    if (!panchayat) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user = {
      _id: panchayat._id,
      name: panchayat.name,
      role: "ADMIN",
      panchayatId: panchayat._id,
    };
  }

  // 4️⃣ Generate JWT
  const token = generateToken({
    userId: user._id,
    role: user.role,
    panchayatId: user.panchayatId,
  });

  // 5️⃣ Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // 6️⃣ Response
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

/**
 * Logout
 */
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

/**
 * Check session
 */
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

export const getProfile = async (req, res) => {
  const panchayat = await Panchayat.findById(req.user.panchayatId)
    .populate("subscriptionId");

  if (!panchayat) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const sub = panchayat.subscriptionId;

  res.json({
    name: panchayat.name,
    contact: panchayat.contactPhone,
    email: panchayat.contactEmail,
    status: panchayat.status === "active",

    // 👇 subscription details
    subscription: sub
      ? {
          plan: sub.planName,
          status: sub.status, // active | expired | cancelled
          startDate: sub.startDate,
          endDate: sub.endDate,
        }
      : "Contact your provider for subscription details",
  });
};

/**
 * UPDATE PROFILE
 */
export const updateProfile = async (req, res) => {
  const { name, contact, email, status } = req.body;

  const panchayat = await Panchayat.findByIdAndUpdate(
    req.user.panchayatId,
    {
      name,
      contactPhone: contact,
      contactEmail: email,
      status: status ? "active" : "inactive",
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Profile updated",
    profile: panchayat,
  });
};

import User from "../models/User.model.js";
import Panchayat from "../models/Panchayat.model.js";
import Employee from "../models/Employee.model.js";
import { generateOTP, verifyOTP } from "../utils/otpService.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Send OTP
 */
export const sendOtp = async (req, res) => {
  const { mobile, type, panchayatId } = req.body;

  if (!mobile) {
    return res.status(400).json({
      message: "Mobile number required",
      success: false,
    });
  }

  // 🔹 EMPLOYEE LOGIN CHECK
  if (type === "employee") {
    if (!panchayatId) {
      return res.status(400).json({
        message: "Panchayat selection is required",
        success: false,
      });
    }

    const employee = await Employee.findOne({
      phone: mobile,
      panchayat: panchayatId,
      status: "active"
    });

    if (!employee) {
      return res.status(404).json({
        message: "Active employee not found for this Panchayat",
        success: false,
      });
    }
  }

  const otp = generateOTP(mobile);

  return res.status(200).json({
    message: "OTP sent successfully",
    success: true,
    otp, // 👈 Send OTP to frontend for toast
  });
};

/**
 * Verify OTP & Login
 */
export const verifyOtpAndLogin = async (req, res) => {
  const { mobile, otp, type, panchayatId } = req.body;

  // 1️⃣ Verify OTP
  if (!verifyOTP(mobile, otp)) {
    return res.status(401).json({
      message: "Invalid OTP",
      success: false,
    });
  }

  let user = null;
  let role = "USER"; // Default

  // 🔹 EMPLOYEE LOGIN
  if (type === "employee") {
     if (!panchayatId) {
        return res.status(400).json({ message: "Panchayat ID required" });
     }

     const employee = await Employee.findOne({
        phone: mobile,
        panchayat: panchayatId,
        status: "active"
     });

     if (!employee) {
        return res.status(404).json({ message: "Employee not found or inactive" });
     }

     user = {
        _id: employee._id,
        name: employee.name,
        role: "EMPLOYEE", // Or employee.role if specific roles exist
        panchayatId: employee.panchayat,
        ward: employee.ward
     };
     role = "EMPLOYEE";

  } else {
      // 2️⃣ Try Normal User login
      user = await User.findOne({ mobile });

      // 3️⃣ Fallback → Panchayat ADMIN
      if (!user) {
        const panchayat = await Panchayat.findOne({
          contactPhone: mobile,
          status: "active",
        });

        if (panchayat) {
           user = {
            _id: panchayat._id,
            name: panchayat.name,
            role: "PANCHAYAT_ADMIN",
            panchayatId: panchayat._id,
          };
          role = "PANCHAYAT_ADMIN";
        }
      }
  }

  if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
  }

  // 4️⃣ Generate JWT
  const token = generateToken({
    userId: user._id,
    role: role,
    panchayatId: user.panchayatId,
    ward: user.ward
  });

  // 5️⃣ Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Always true for cross-site
    sameSite: "none", // Required for cross-site (localhost -> render)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // 6️⃣ Response
  return res.status(200).json({
    message: "Login successful",
    success: true,
    token, // Return token for mobile app
    user: {
      id: user._id,
      name: user.name,
      role: role,
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
      secure: true,
      sameSite: "none",
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

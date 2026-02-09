import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Panchayat from "../models/Panchayat.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try User first
    const user = await User.findById(decoded.userId);
    if (user) {
      req.user = {
        _id: user._id,
        role: user.role,
        panchayat: user.panchayat, // Added panchayat field for Dashboard logic
      };
      return next();
    }

    // Try Panchayat admin
    const panchayat = await Panchayat.findById(decoded.userId);
    if (!panchayat || panchayat.status !== "active") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      _id: panchayat._id,
      role: "PANCHAYAT_ADMIN",
      panchayatId: panchayat._id,
    };

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

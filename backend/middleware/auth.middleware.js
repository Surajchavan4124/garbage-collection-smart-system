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

    let authEntity = null;

    // 1. Try User (super admin)
    authEntity = await User.findById(decoded.userId);

    // 2. Fallback to Panchayat (admin)
    if (!authEntity) {
      const panchayat = await Panchayat.findById(decoded.userId);
      if (!panchayat || panchayat.status !== "active") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      authEntity = {
        _id: panchayat._id,
        role: "ADMIN",
        panchayatId: panchayat._id,
      };
    }

    req.user = authEntity;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

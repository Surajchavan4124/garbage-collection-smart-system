import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Panchayat from "../models/Panchayat.model.js";
import Subscription from "../models/Subscription.model.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Also check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract directly from token if possible (for Employee/Admin)
    if (decoded.role === "EMPLOYEE") {
      req.user = {
        _id: decoded.userId,
        role: "EMPLOYEE",
        panchayatId: decoded.panchayatId,
        panchayat: decoded.panchayatId, // Consistent naming
        wards: decoded.wards || []
      };
    } else if (decoded.role === "ADMIN" || decoded.role === "PANCHAYAT_ADMIN") {
      req.user = {
        _id: decoded.userId,
        role: "PANCHAYAT_ADMIN",
        panchayatId: decoded.panchayatId || decoded.userId,
        panchayat: decoded.panchayatId || decoded.userId, // Consistent naming
      };
    } else {
      // Try User first (Super Admin etc)
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = {
          _id: user._id,
          role: user.role,
        };
      } else {
        // Fallback try Panchayat model (Legacy support)
        const panchayat = await Panchayat.findById(decoded.userId);
        if (panchayat && panchayat.status === "active") {
          req.user = {
            _id: panchayat._id,
            role: "PANCHAYAT_ADMIN",
            panchayatId: panchayat._id,
            panchayat: panchayat._id, // Consistent naming
          };
        }
      }
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 SUBSCRIPTION CHECK (Block access if EXPIRED past grace period)
    // Only block PANCHAYAT_ADMIN and EMPLOYEE roles. Prevent blocking COMPANY_ADMIN.
    if (
      (req.user.role === "PANCHAYAT_ADMIN" || req.user.role === "EMPLOYEE") &&
      !req.originalUrl.startsWith("/api/auth") &&
      req.user.panchayatId
    ) {
      const subscription = await Subscription.findOne({ panchayatId: req.user.panchayatId });
      if (subscription) {
        const graceEndDate = new Date(subscription.graceEndDate);
        if (new Date() > graceEndDate) {
          return res.status(403).json({
            success: false,
            message: "Subscription expired. Contact company for renewal.",
            errorCode: "SUBSCRIPTION_EXPIRED"
          });
        }
      }
    }

    return next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

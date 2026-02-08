import Attendance from "../models/attendance.model.js";
import AttendanceScan from "../models/attendanceScan.model.js";
import Dustbin from "../models/dustbin.model.js";
import Employee from "../models/Employee.model.js";
import User from "../models/User.model.js";
import { getDistance } from "geolib";


const RADIUS_METERS = 5000; // Increased for Testing (was 20)

const today = () => new Date().toISOString().split("T")[0];

// 🔹 QR SCAN (LABOUR)
export const scanAttendance = async (req, res) => {
  try {
    const panchayatId = req.user.panchayat;
    const { labourId, dustbinId, lat, lng, isOffline } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "GPS required" });
    }

    // If labourId is provided (from frontend as User ID)
    const userId = labourId || req.user._id;

    // 1. Get User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Find Employee by Mobile
    const labour = await Employee.findOne({
      phone: user.mobile,
      panchayat: panchayatId,
      status: "active",
    });

    if (!labour) {
      return res.status(404).json({ message: "Invalid labour" });
    }

    // Support QR code being an ObjectId OR a Bin Code (e.g. B-9394)
    let dustbinQuery = { panchayat: panchayatId, isActive: true };

    // Check if it's a valid ObjectId (MongoDB ID)
    if (dustbinId.match(/^[0-9a-fA-F]{24}$/)) {
      dustbinQuery._id = dustbinId;
    } else {
      // Otherwise assume it's a Bin Code
      dustbinQuery.binCode = dustbinId;
    }

    const dustbin = await Dustbin.findOne(dustbinQuery);

    if (!dustbin) {
      return res.status(404).json({ message: "Invalid dustbin" });
    }

    const distance = getDistance(
      { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      { latitude: dustbin.geo.lat, longitude: dustbin.geo.lng }
    );

    console.log(`\n📏 DISTANCE CHECK:`);
    console.log(`- Scan Location: ${lat}, ${lng}`);
    console.log(`- Bin Location:  ${dustbin.geo.lat}, ${dustbin.geo.lng}`);
    console.log(`- Calculated:    ${distance} meters`);
    console.log(`- Allowed:       ${RADIUS_METERS} meters`);

    const date = today();

    let result = "SUCCESS";

    const existing = await Attendance.findOne({
      panchayat: panchayatId,
      labour: labourId,
      date,
    });

    if (distance > RADIUS_METERS) {
      console.log("❌ OUT OF RANGE (Ignored for Test - Distance was " + distance + ")");
      // result = "OUT_OF_RANGE"; // Disabled for now!
      result = "SUCCESS";
    } else if (existing) {
      // Allow multiple scans, but mark as SUCCESS (log it)
      result = "SUCCESS";
    }

    const scanRecord = await AttendanceScan.create({
      panchayat: panchayatId,
      labour: labourId,
      dustbin: dustbin._id, // Use resolved ObjectId
      geo: { lat, lng },
      distance,
      isOffline: !!isOffline,
      result,
      date,
    });

    if (result !== "SUCCESS") {
      return res.status(400).json({ message: result });
    }

    // Only create Attendance if it doesn't exist
    if (!existing) {
      await Attendance.create({
        panchayat: panchayatId,
        labour: labourId,
        date,
        present: true,
        source: "QR",
        geo: { lat, lng },
      });
    }

    res.json({
      message: "Scan recorded",
      scanId: scanRecord._id,
      bin: {
        _id: dustbin._id,
        binCode: dustbin.binCode,
        location: dustbin.locationText,
        type: dustbin.type
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 ADMIN MANUAL MARK
export const manualAttendance = async (req, res) => {
  try {
    const { labourId, date, reason } = req.body;

    if (req.user.role !== "PANCHAYAT_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const panchayatId = req.user.panchayatId;

    if (!panchayatId) {
      return res.status(401).json({ message: "Invalid auth context" });
    }

    if (!labourId || !date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Attendance.findOne({
      labour: labourId,
      date,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Attendance already exists for today" });
    }

    const attendance = await Attendance.create({
      labour: labourId,
      panchayat: panchayatId,
      date,
      present: true,
      source: "ADMIN",
      reason,
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// 🔹 UPDATE SCAN ACTION
export const updateScanAction = async (req, res) => {
  try {
    const { scanId, action, issueDescription } = req.body;

    if (!scanId || !action) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const scan = await AttendanceScan.findByIdAndUpdate(
      scanId,
      {
        action,
        issueDescription: issueDescription || ""
      },
      { new: true }
    );

    if (!scan) {
      return res.status(404).json({ message: "Scan record not found" });
    }

    // TODO: If action is 'collected', maybe update Dustbin lastCollected status?

    res.json({ success: true, message: "Action updated", scan });
  } catch (error) {
    console.error("Update Action Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const panchayatId = req.user.panchayat;
    const userId = req.user._id;

    // 1. Get User Details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Find Employee by Mobile (User.mobile matches Employee.phone)
    const employee = await Employee.findOne({ phone: user.mobile });
    if (!employee) return res.status(404).json({ message: "Employee record not found" });

    // 2. Find Total Bins in this Ward
    // We assume 'locationText' contains the Ward name (e.g. "Navelim Ward 4")
    const totalBins = await Dustbin.countDocuments({
      panchayat: panchayatId,
      isActive: true,
      locationText: { $regex: employee.ward, $options: "i" }
    });

    // 3. Find IDs of Bins in this Ward
    const wardBins = await Dustbin.find({
      panchayat: panchayatId,
      isActive: true,
      locationText: { $regex: employee.ward, $options: "i" }
    }).select("_id");

    const wardBinIds = wardBins.map(b => b._id);

    // 4. Count Collected Bins Today (Only for bins in this ward)
    const todayStr = new Date().toISOString().split("T")[0];

    const collectedCount = await AttendanceScan.countDocuments({
      panchayat: panchayatId,
      date: todayStr,
      action: "collected",
      dustbin: { $in: wardBinIds }
    });

    // 5. Calculate Pending
    const pending = totalBins - collectedCount;

    res.json({
      ward: employee.ward,
      total: totalBins,
      completed: collectedCount,
      pending: pending > 0 ? pending : 0
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  // ... existing code ...
  try {
    const date = new Date().toISOString().split("T")[0];

    // 🔹 STEP 1: Fetch ALL employees (no filters first)
    const employees = await Employee.find({}).lean();

    // ... (rest of the function)
    const attendance = await Attendance.find({ date }).lean();
    const attendanceMap = {};
    attendance.forEach(a => { attendanceMap[a.labour.toString()] = a; });

    const result = employees.map(emp => {
      const att = attendanceMap[emp._id.toString()];
      return {
        labour: {
          _id: emp._id,
          name: emp.name,
          employeeCode: emp.employeeCode,
          role: emp.role,
          ward: emp.ward,
        },
        present: !!att,
        source: att ? att.source : null,
        markedAt: att ? att.markedAt : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: err.message });
  }
};

import AttendanceScan from "../models/attendanceScan.model.js";
import Dustbin from "../models/dustbin.model.js";
import { getDistanceInMeters } from "../utils/geo.util.js";
import Employee from "../models/Employee.model.js";
import Attendance from "../models/attendance.model.js";


const RADIUS_METERS = 20;

const today = () => new Date().toISOString().split("T")[0];

// 🔹 QR SCAN (LABOUR)
export const scanAttendance = async (req, res) => {
  try {
    const panchayatId = req.user.panchayat;
    const { labourId, dustbinId, lat, lng, isOffline } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "GPS required" });
    }

    const labour = await Employee.findOne({
      _id: labourId,
      panchayat: panchayatId,
      status: "active",
    });

    if (!labour) {
      return res.status(404).json({ message: "Invalid labour" });
    }

    const dustbin = await Dustbin.findOne({
      _id: dustbinId,
      panchayat: panchayatId,
      isActive: true,
    });

    if (!dustbin) {
      return res.status(404).json({ message: "Invalid dustbin" });
    }

    const distance = getDistanceInMeters(
      lat,
      lng,
      dustbin.geo.lat,
      dustbin.geo.lng
    );

    const date = today();

    let result = "SUCCESS";

    const existing = await Attendance.findOne({
      panchayat: panchayatId,
      labour: labourId,
      date,
    });

    if (distance > RADIUS_METERS) {
      result = "OUT_OF_RANGE";
    } else if (existing) {
      result = "DUPLICATE";
    }

    await AttendanceScan.create({
      panchayat: panchayatId,
      labour: labourId,
      dustbin: dustbinId,
      geo: { lat, lng },
      distance,
      isOffline: !!isOffline,
      result,
      date,
    });

    if (result !== "SUCCESS") {
      return res.status(400).json({ message: result });
    }

    await Attendance.create({
      panchayat: panchayatId,
      labour: labourId,
      date,
      present: true,
      source: "QR",
      geo: { lat, lng },
    });

    res.json({ message: "Attendance marked" });
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
// 🔹 TODAY VIEW

export const getTodayAttendance = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];

    // 🔹 STEP 1: Fetch ALL employees (no filters first)
    const employees = await Employee.find({}).lean();



    // 🔹 STEP 2: Fetch today's attendance
    const attendance = await Attendance.find({ date }).lean();

    // 🔹 STEP 3: Map attendance by employee ID
    const attendanceMap = {};
    attendance.forEach(a => {
      attendanceMap[a.labour.toString()] = a;
    });

    // 🔹 STEP 4: Merge result
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

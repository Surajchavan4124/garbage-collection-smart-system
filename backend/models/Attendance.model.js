// backend/models/Attendance.model.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    panchayatId: { type: mongoose.Schema.Types.ObjectId, ref: "Panchayat" },
    
    date: { type: Date, required: true }, // Store YYYY-MM-DD (set time to 00:00:00)
    status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
    
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    
    gpsLocation: {
      latitude: Number,
      longitude: Number
    }
  },
  { timestamps: true }
);

// Ensure one record per user per day
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
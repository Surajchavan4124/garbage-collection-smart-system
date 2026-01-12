import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
      index: true,
    },

    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    present: {
      type: Boolean,
      default: true,
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },

    source: {
      type: String,
      enum: ["QR", "ADMIN"],
      required: true,
    },

    geo: {
      lat: Number,
      lng: Number,
    },

    overrideReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// ONE attendance per labour per day per panchayat
attendanceSchema.index(
  { panchayat: 1, labour: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);

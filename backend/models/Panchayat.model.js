import mongoose from "mongoose";
const PanchayatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },

    householdLimit: {
      type: Number,
      default: 0,
    },
    labourLimit: {
      type: Number,
      default: 0,
    },

    subscriptionActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Panchayat", PanchayatSchema);

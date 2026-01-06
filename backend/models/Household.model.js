// backend/models/Household.model.js
import mongoose from "mongoose";

const HouseholdSchema = new mongoose.Schema(
  {
    headOfHousehold: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    ward: { type: String, required: true },
    
    // Links the household to a specific panchayat
    panchayatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
    },
    
    // For tracking segregation (Green/Red) status seen in your dashboard
    segregationCompliance: {
      type: String,
      enum: ["Compliant", "Non-Compliant"],
      default: "Compliant",
    },
    
    // Unique ID for QR codes (e.g., H-001)
    householdCode: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Household", HouseholdSchema);
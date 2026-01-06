// backend/models/Complaint.model.js
import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    panchayatId: { type: mongoose.Schema.Types.ObjectId, ref: "Panchayat" },
    
    category: { 
      type: String, 
      enum: ["Bin Full", "Missed Collection", "Staff Behavior", "Other"],
      required: true 
    },
    description: { type: String },
    photoUrl: { type: String }, // For uploaded evidence
    
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    
    adminComment: { type: String }, // For admin response
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
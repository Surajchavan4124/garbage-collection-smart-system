import mongoose from "mongoose";
const SubscriptionSchema = new mongoose.Schema(
  {
    panchayatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
    },

    planName: {
      type: String,
      required: true,
    },

    householdLimit: {
      type: Number,
      required: true,
    },

    labourLimit: {
      type: Number,
      required: true,
    },

    features: {
      type: [String], // e.g. ["CMS", "REPORTS", "SMS"]
      default: [],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    graceEndDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "expired", "grace"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);

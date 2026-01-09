import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
      unique: true,
    },

    planName: {
      type: String,
      enum: ["BASIC", "STANDARD", "PREMIUM"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);

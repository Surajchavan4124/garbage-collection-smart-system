import mongoose from "mongoose";

const DustbinSchema = new mongoose.Schema(
  {
    panchayatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true, // QR value
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "damaged", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dustbin", DustbinSchema);

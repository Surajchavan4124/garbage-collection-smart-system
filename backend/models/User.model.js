import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: [
        "COMPANY_ADMIN",
        "PANCHAYAT_ADMIN",
        "EMPLOYEE"
      ],
      required: true,
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat"
    },

    profilePhoto: {
      type: String, // URL
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export default mongoose.models.User || mongoose.model("User", UserSchema);

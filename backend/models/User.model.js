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
        "SUPERVISOR",
        "LABOUR",
        "PUBLIC",
      ],
      required: true,
    },

    panchayatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      default: null, // null only for COMPANY_ADMIN
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
export default mongoose.model("User", UserSchema);

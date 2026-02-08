import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
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
        "EMPLOYEE",
        "USER"
      ],
      required: true,
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
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

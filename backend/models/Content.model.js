import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
    },
    type: {
      type: String,
      enum: ["about-us", "segregation-guide", "contact-info", "announcement"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String, // HTML or Markdown content
      required: true,
    },
    media: [
      {
        url: { type: String },
        type: { type: String, enum: ["image", "video"] },
        caption: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Ensure one content type per panchayat
contentSchema.index({ panchayat: 1, type: 1 }, { unique: true });

export default mongoose.model("Content", contentSchema);

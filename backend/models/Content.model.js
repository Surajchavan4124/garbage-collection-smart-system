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
      required: false,
    },
    media: [
      {
        url: { type: String },
        type: { type: String, enum: ["image", "video", "file"] },
        caption: { type: String },
      },
    ],
    // New field for structured sections (Mission, Problem, Solution)
    cards: [
      {
        title: { type: String },
        content: { type: String },
        icon: { type: String } // stored as string identifier or url if needed
      }
    ],

    // Stats section (e.g. "2,500+ Households Served")
    stats: [
      {
        value: { type: String },
        label: { type: String },
      }
    ],

    // Accordion items (Mission, Objectives, How It Works, Legal)
    accordionItems: [
      {
        id: { type: String },
        title: { type: String },
        content: { type: String },
        list: [{ type: String }],
      }
    ],

    // Guiding principles cards
    principles: [
      {
        emoji: { type: String },
        title: { type: String },
        desc: { type: String },
      }
    ],

    // CTA section
    ctaHeading: { type: String },
    ctaSubtext: { type: String },

    // Guide / Resource cards (used in segregation-guide page)
    guides: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
        type: { type: String }, // 'PDF Guide' | 'Video Guide' | 'Article'
        color: { type: String },
        iconColor: { type: String },
        tag: { type: String },
        steps: [{ type: String }],
      }
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

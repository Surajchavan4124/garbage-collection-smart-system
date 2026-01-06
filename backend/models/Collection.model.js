import mongoose from 'mongoose'

const CollectionSchema = new mongoose.Schema(
  {
    panchayatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panchayat',
      required: true,
    },

    dustbinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dustbin',
      required: true,
    },

    labourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    latitude: Number,
    longitude: Number,

    distance: Number, // meters

    attendanceMarked: {
      type: Boolean,
      default: false,
    },

    gpsValid: {
      type: Boolean,
      default: true,
    },

    selfieUrl: {
      type: String,
    },

    selfieRequired: {
      type: Boolean,
      default: false,
    },

    selfieVerified: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Collection', CollectionSchema)

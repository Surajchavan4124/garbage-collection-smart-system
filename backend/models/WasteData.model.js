import mongoose from 'mongoose'

const wasteDataSchema = new mongoose.Schema({
  entryId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  collectionType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Daily'
  },
  ward: {
    type: String,
    required: true
  },
  biodegradable: {
    type: Number,
    default: 0
  },
  recyclable: {
    type: Number,
    default: 0
  },
  nonBiodegradable: {
    type: Number,
    default: 0
  },
  mixed: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const WasteData = mongoose.model('WasteData', wasteDataSchema)

export default WasteData

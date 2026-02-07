import WasteData from '../models/WasteData.model.js'

// Create new waste data entry
export const createWasteData = async (req, res) => {
  try {
    const { date, collectionType, ward, biodegradable, recyclable, nonBiodegradable, mixed } = req.body

    // Simple validation
    if (!date || !ward) {
      return res.status(400).json({ message: "Date and Ward are required" })
    }

    const biodeg = parseFloat(biodegradable) || 0
    const recycl = parseFloat(recyclable) || 0
    const nonBiodeg = parseFloat(nonBiodegradable) || 0
    const mix = parseFloat(mixed) || 0
    const total = biodeg + recycl + nonBiodeg + mix

    // Generate Entry ID (W-01, W-02, etc.)
    const count = await WasteData.countDocuments()
    const entryId = `W-${String(count + 1).padStart(2, '0')}`

    const newEntry = new WasteData({
      entryId,
      date,
      collectionType,
      ward,
      biodegradable: biodeg,
      recyclable: recycl,
      nonBiodegradable: nonBiodeg,
      mixed: mix,
      total
    })

    await newEntry.save()
    res.status(201).json(newEntry)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all waste data entries
export const getAllWasteData = async (req, res) => {
  try {
    const wasteData = await WasteData.find().sort({ createdAt: -1 })
    res.status(200).json(wasteData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete waste data entry
export const deleteWasteData = async (req, res) => {
  try {
    const { id } = req.params
    await WasteData.findByIdAndDelete(id)
    res.status(200).json({ message: "Entry deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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
    res.status(500).json({ message: error.message })
  }
}

// Update waste data entry
export const updateWasteData = async (req, res) => {
  try {
    const { id } = req.params
    const { date, collectionType, ward, biodegradable, recyclable, nonBiodegradable, mixed } = req.body

    const biodeg = parseFloat(biodegradable) || 0
    const recycl = parseFloat(recyclable) || 0
    const nonBiodeg = parseFloat(nonBiodegradable) || 0
    const mix = parseFloat(mixed) || 0
    const total = biodeg + recycl + nonBiodeg + mix

    const updatedEntry = await WasteData.findByIdAndUpdate(
      id,
      {
        date,
        collectionType,
        ward,
        biodegradable: biodeg,
        recyclable: recycl,
        nonBiodegradable: nonBiodeg,
        mixed: mix,
        total
      },
      { new: true }
    )

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" })
    }

    res.status(200).json(updatedEntry)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get waste stats
export const getWasteStats = async (req, res) => {
  try {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

    const weeklyTotal = await WasteData.aggregate([
      { $match: { date: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ])

    const monthlyTotal = await WasteData.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ])

    const lastMonthTotal = await WasteData.aggregate([
      { $match: { date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ])

    const recentCollections = await WasteData.find().sort({ date: -1 }).limit(10)

    res.status(200).json({
      weeklyTotal: weeklyTotal[0]?.total || 0,
      monthlyTotal: monthlyTotal[0]?.total || 0,
      lastMonthTotal: lastMonthTotal[0]?.total || 0,
      recentCollections
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

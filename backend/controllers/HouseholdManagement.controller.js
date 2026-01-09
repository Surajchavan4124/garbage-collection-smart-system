import Household from "../models/Household.model.js";

// @desc    Add a new household
// @route   POST /api/households
// @access  Private (Panchayat Admin)
export const addHousehold = async (req, res) => {
  try {
    const { headOfHousehold, contact, address, ward, householdCode } = req.body;

    const household = await Household.create({
      headOfHousehold,
      contact,
      address,
      ward,
      householdCode,
      panchayatId: req.user.panchayatId, // Auto-link to admin's panchayat
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all households for the logged-in panchayat
// @route   GET /api/households
// @access  Private (Panchayat Admin)
export const getHouseholds = async (req, res) => {
  try {
    const households = await Household.find({
      panchayatId: req.user.panchayatId,
    }).sort({ createdAt: -1 });

    res.json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update household details
// @route   PUT /api/households/:id
// @access  Private
export const updateHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household || household.panchayatId.toString() !== req.user.panchayatId.toString()) {
      return res.status(404).json({ message: "Household not found" });
    }

    const updatedHousehold = await Household.findByIdAndUpdate(
      req.params.id,
      req.body, // { address, ward, contact, etc. }
      { new: true }
    );

    res.json(updatedHousehold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a household
// @route   DELETE /api/households/:id
// @access  Private
export const deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household || household.panchayatId.toString() !== req.user.panchayatId.toString()) {
      return res.status(404).json({ message: "Household not found" });
    }

    await household.deleteOne();
    res.json({ message: "Household removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Subscription from "../models/Subscription.model.js";
import Panchayat from "../models/Panchayat.model.js";

const PLAN_CONFIG = {
  BASIC: { householdLimit: 100, labourLimit: 10, durationDays: 365 },
  STANDARD: { householdLimit: 300, labourLimit: 30, durationDays: 365 },
  PREMIUM: { householdLimit: 500, labourLimit: 50, durationDays: 365 },
};

export const createSubscription = async (req, res) => {
  try {
    const { panchayatId, planName } = req.body;

    if (!panchayatId || !PLAN_CONFIG[planName]) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const panchayat = await Panchayat.findById(panchayatId);
    if (!panchayat) {
      return res.status(404).json({ message: "Panchayat not found" });
    }

    if (panchayat.subscriptionId) {
      return res
        .status(400)
        .json({ message: "Subscription already exists for this Panchayat" });
    }

    const { householdLimit, labourLimit, durationDays } =
      PLAN_CONFIG[planName];

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    const graceEndDate = new Date(endDate);
    graceEndDate.setDate(endDate.getDate() + 7);

    const subscription = await Subscription.create({
      panchayatId,
      planName,
      householdLimit,
      labourLimit,
      startDate,
      endDate,
      graceEndDate,
      status: "ACTIVE", // ✅ ENUM-CORRECT
    });

    // 🔑 THIS IS THE CRITICAL LINE
    panchayat.subscriptionId = subscription._id;
    await panchayat.save();

    return res.status(201).json({
      message: "Subscription created successfully",
      subscriptionId: subscription._id,
    });
  } catch (err) {
    console.error("CREATE SUBSCRIPTION ERROR:", err);
    return res.status(500).json({ message: "Failed to create subscription" });
  }
};

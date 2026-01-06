import Subscription from "../models/Subscription.model.js";
import Panchayat from "../models/Panchayat.model.js";

export const createSubscription = async (req, res) => {
  const {
    panchayatId,
    planName,
    householdLimit,
    labourLimit,
    durationDays,
  } = req.body;

  // sanity log
  console.log("Creating subscription for Panchayat:", panchayatId);

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + durationDays);

  const graceEndDate = new Date(endDate);
  graceEndDate.setDate(endDate.getDate() + 7);

  // 1️⃣ create subscription
  const subscription = await Subscription.create({
    panchayatId,
    planName,
    householdLimit,
    labourLimit,
    startDate,
    endDate,
    graceEndDate,
    status: "active",
  });

  // 2️⃣ APPLY subscription to Panchayat (THIS WAS MISSING)
  const updatedPanchayat = await Panchayat.findByIdAndUpdate(
    panchayatId,
    {
      householdLimit,
      labourLimit,
      subscriptionActive: true,
    },
    { new: true }
  );

  console.log("Updated Panchayat:", updatedPanchayat);

  res.status(201).json({
    message: "Subscription created and applied to Panchayat",
    subscription,
    panchayat: updatedPanchayat,
  });
};

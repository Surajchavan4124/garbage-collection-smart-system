import Subscription from "../models/Subscription.model.js";

/**
 * LIST ALL PANCHAYAT SUBSCRIPTIONS (Company Admin)
 */
export const listPanchayatSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find()
    .populate("panchayat", "name")
    .sort({ createdAt: -1 });

  const data = subscriptions.map((sub) => {
    const isExpired = new Date(sub.endDate) < new Date();

    return {
      _id: sub._id,
      panchayatName: sub.panchayat.name,
      planName: sub.planName,
      endDate: sub.endDate,
      status: isExpired ? "Expired" : "Active",
    };
  });

  res.status(200).json(data);
};

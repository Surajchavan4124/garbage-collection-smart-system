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

export const getSubscriptionByPanchayat = async (req, res) => {
  try {
    const { panchayatId } = req.params;

    const subscription = await Subscription.findOne({
      panchayat: panchayatId,
    }).populate("panchayat", "name");

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found for this panchayat",
      });
    }

    const isExpired = new Date(subscription.endDate) < new Date();

    return res.status(200).json({
      _id: subscription._id,
      panchayat: subscription.panchayat,
      planName: subscription.planName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: isExpired ? "expired" : "active",
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      message: "Failed to fetch subscription",
    });
  }
};

/**
 * LIST ALL SUBSCRIPTIONS (Company Admin)
 * Used by: Subscription Management table
 */
export const listAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("panchayat", "name")
      .sort({ createdAt: -1 });

    const data = subscriptions.map((sub) => {
      const isExpired = new Date(sub.endDate) < new Date();

      return {
        _id: sub._id,
        panchayatName: sub.panchayat?.name || "Unknown",
        planName: sub.planName,
        startDate: sub.startDate,
        endDate: sub.endDate,
        status: isExpired ? "Expired" : "Active",
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("List subscriptions error:", error);
    res.status(500).json({
      message: "Failed to fetch subscriptions",
    });
  }
};
import Panchayat from "../models/Panchayat.model.js";
import Subscription from "../models/Subscription.model.js";

export const getCompanyDashboard = async (req, res) => {
  const totalPanchayats = await Panchayat.countDocuments();

  const activeSubscriptionsAgg = await Panchayat.aggregate([
    {
      $match: {
        subscriptionId: { $ne: null }, // Panchayat has a subscription
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "subscriptionId",
        foreignField: "_id",
        as: "subscription",
      },
    },
    { $unwind: "$subscription" },
    {
      $match: {
        "subscription.status": "ACTIVE",
      },
    },
    {
      $count: "count",
    },
  ]);

  const activeSubscriptions =
    activeSubscriptionsAgg.length > 0 ? activeSubscriptionsAgg[0].count : 0;

  const pendingRequests = await Panchayat.countDocuments({
    status: "pending",
  });

  res.status(200).json({
    totalPanchayats,
    activeSubscriptions,
    pendingRequests,
  });
};


export const getCompanyProfile = async (req, res) => {
  try {
    const user = req.user; // set by protect middleware

    res.json({
      name: user.name,
      phone: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

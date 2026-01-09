import Panchayat from "../models/Panchayat.model.js";
import Subscription from "../models/Subscription.model.js";

export const getCompanyDashboard = async (req, res) => {
  const totalPanchayats = await Panchayat.countDocuments();
  const activeSubscriptions = await Subscription.countDocuments({
    status: "active",
  });
  const pendingRequests = await Panchayat.countDocuments({
    status: "pending",
  });

  res.status(200).json({
    totalPanchayats,
    activeSubscriptions,
    pendingRequests,
  });
};


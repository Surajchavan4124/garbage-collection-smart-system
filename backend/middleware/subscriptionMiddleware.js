import Subscription from "../models/Subscription.model.js";

export const checkSubscription = async (req, res, next) => {
  if (!req.user.panchayatId) return next();

  const sub = await Subscription.findOne({
    panchayatId: req.user.panchayatId,
    status: { $in: ["active", "grace"] },
  });

  if (!sub) {
    return res.status(403).json({ message: "Subscription expired" });
  }

  next();
};

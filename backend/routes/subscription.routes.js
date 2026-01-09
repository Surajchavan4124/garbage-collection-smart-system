import express from "express";
import { createSubscription } from "../controllers/subscription.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// routes/subscriptionRoutes.js
router.post(
  "/panchayats/:panchayatId",
  protect,
  allowRoles("COMPANY_ADMIN"),
  createSubscription
);

router.get(
  "/panchayats/:panchayatId",
  protect,
  allowRoles("COMPANY_ADMIN"),
  getSubscriptionByPanchayat
);

router.get(
  "/panchayats",
  protect,
  allowRoles("COMPANY_ADMIN"),
  listAllSubscriptions
);

export default router;

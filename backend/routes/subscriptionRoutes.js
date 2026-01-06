import express from "express";
import { createSubscription } from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("COMPANY_ADMIN"),
  createSubscription
);

export default router;

import express from "express";
import { createSubscription } from "../controllers/subscription.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("COMPANY_ADMIN"),
  createSubscription
);

export default router;

import express from "express";
import { scanDustbin } from "../controllers/collection.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

router.post(
  "/sync",
  protect,
  checkSubscription,
  allowRoles("LABOUR"),
  scanDustbin
);


export default router;

import express from "express";
import { createDustbin, listDustbins } from "../controllers/dustbinController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  checkSubscription,
  allowRoles("PANCHAYAT_ADMIN"),
  createDustbin
);

router.get(
  "/",
  protect,
  checkSubscription,
  allowRoles("PANCHAYAT_ADMIN", "SUPERVISOR"),
  listDustbins
);

export default router;

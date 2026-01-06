import express from "express";
import { missedCollectionsReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";

import {
  gpsInvalidReport,
  selfieRequiredReport,
  dailyDashboardSummary,
} from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/missed-collections",
  protect,
  checkSubscription,
  allowRoles("PANCHAYAT_ADMIN", "SUPERVISOR"),
  missedCollectionsReport
);

router.get(
  "/gps-invalid",
  protect,
  checkSubscription,
  allowRoles("PANCHAYAT_ADMIN", "SUPERVISOR"),
  gpsInvalidReport
);


router.get(
  "/selfie-required",
  protect,
  checkSubscription,
  allowRoles("PANCHAYAT_ADMIN", "SUPERVISOR"),
  selfieRequiredReport
);

router.get(
  "/dashboard-summary",
  protect,
  checkSubscription,
  allowRoles("PANCHAYAT_ADMIN", "SUPERVISOR"),
  dailyDashboardSummary
);


export default router;




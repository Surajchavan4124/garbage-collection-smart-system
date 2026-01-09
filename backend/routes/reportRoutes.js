import express from "express";
import { missedCollectionsReport } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { checkSubscription } from "../middleware/subscription.middleware.js";

import {
  gpsInvalidReport,
  selfieRequiredReport,
  dailyDashboardSummary,
} from "../controllers/report.controller.js";

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




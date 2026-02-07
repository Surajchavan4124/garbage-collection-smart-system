import express from "express";
import {
  registerHousehold,
  getHouseholds,
  updateHousehold,
  updateHouseholdStatus,
  deleteHousehold,
} from "../controllers/household.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// router.post("/", registerHousehold); // Public registration allowed? Revisit auth if needed.
// router.post("/", registerHousehold); // Public registration allowed? Revisit auth if needed.
router.post("/", protect, registerHousehold); // Changed to protected for Admin use. Public reg will need separate logic or optional auth.
router.get("/", protect, getHouseholds);
router.put("/:id", protect, allowRoles("PANCHAYAT_ADMIN"), updateHousehold);
router.patch("/:id/status", protect, allowRoles("PANCHAYAT_ADMIN"), updateHouseholdStatus);
router.delete("/:id", protect, allowRoles("PANCHAYAT_ADMIN"), deleteHousehold);

export default router;

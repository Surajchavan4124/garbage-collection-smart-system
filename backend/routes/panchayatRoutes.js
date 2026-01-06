import express from "express";
import { registerPanchayat } from "../controllers/panchayatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { approvePanchayat } from "../controllers/panchayatController.js";


const router = express.Router();

router.post("/register", registerPanchayat);

export default router;

router.patch(
  "/approve/:id",
  protect,
  allowRoles("COMPANY_ADMIN"),
  approvePanchayat
);

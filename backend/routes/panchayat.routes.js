import express from "express";
import { createPanchayat, listPanchayats } from "../controllers/panchayat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { approvePanchayat } from "../controllers/panchayat.controller.js";


const router = express.Router();

router.post("/register", createPanchayat);
router.get("/", listPanchayats);

export default router;

router.patch(
  "/approve/:id",
  protect,
  allowRoles("COMPANY_ADMIN"),
  approvePanchayat
);

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { postBin, getAllBins, getAdminBins, getBinById } from "../controllers/bin.controller.js";

const router = express.Router();

// Matches Video Logic at 2:06:50
router.route("/post").post(isAuthenticated, postBin);
router.route("/get").get(isAuthenticated, getAllBins);
router.route("/getadminbins").get(isAuthenticated, getAdminBins);
router.route("/get/:id").get(isAuthenticated, getBinById);

export default router;
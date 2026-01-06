import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { requestCleanup, getCollectionHistory, getApplicantsForBin, updateStatus } from "../controllers/collection.controller.js";

const router = express.Router();

// Matches Video Logic at 2:37:03
router.route("/apply/:id").get(isAuthenticated, requestCleanup); // Citizen reports full bin
router.route("/get").get(isAuthenticated, getCollectionHistory); // Driver/Admin sees history
router.route("/:id/applicants").get(isAuthenticated, getApplicantsForBin); // See who reported a specific bin
router.route("/status/:id/update").post(isAuthenticated, updateStatus); // Admin marks as "Collected"

export default router;
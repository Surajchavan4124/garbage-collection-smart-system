import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerArea, getArea, getAreaById, updateArea } from "../controllers/area.controller.js";

const router = express.Router();

// Matches Video Logic at 1:40:46
router.route("/register").post(isAuthenticated, registerArea);
router.route("/get").get(isAuthenticated, getArea);
router.route("/get/:id").get(isAuthenticated, getAreaById);
router.route("/update/:id").put(isAuthenticated, updateArea);

export default router;
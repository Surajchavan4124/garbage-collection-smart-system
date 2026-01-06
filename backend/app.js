import express, { application } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import panchayatRoutes from "./routes/panchayatRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import dustbinRoutes from "./routes/dustbinRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Garbage System API running");
});

app.get("/api/test/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.use("/api/panchayat", panchayatRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dustbins", dustbinRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/reports", reportRoutes);



export default app;

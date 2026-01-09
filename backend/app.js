import express, { application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middleware/auth.middleware.js";
import panchayatRoutes from "./routes/panchayat.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import dustbinRoutes from "./routes/dustbinRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import companyRoutes from "./routes/company.routes.js";
import path from "path";
const app = express();
app.use(express.json());  
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
}
app.use(cors(corsOptions));

// app.get("/", (req, res) => {
//   return res.status(200).json({ 
//     message: "API is running...",
//     success: true
//   });
// });
app.use("/api/panchayat", panchayatRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dustbins", dustbinRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/company", companyRoutes);



export default app;

import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import compression from "compression";
import connectDB from "./utils/db.js";

connectDB();

app.use(compression());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Indexes refreshed

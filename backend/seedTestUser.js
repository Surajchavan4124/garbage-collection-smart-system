import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const mobile = "1111111111";

        // Check if exists
        const existing = await User.findOne({ mobile });
        if (existing) {
            console.log("User 1111111111 already exists.");
            process.exit();
        }

        await User.create({
            name: "Test User",
            mobile: mobile,
            role: "COMPANY_ADMIN",
            isActive: true,
        });

        console.log("✅ User 1111111111 created successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }
};

seedUser();

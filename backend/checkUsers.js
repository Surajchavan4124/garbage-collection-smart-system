import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

const checkUsers = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected!");

        const users = await User.find({});

        console.log("\n--- LIST OF USERS ---");
        if (users.length === 0) {
            console.log("No users found.");
        } else {
            users.forEach(user => {
                console.log(`Name: ${user.name}`);
                console.log(`Mobile: ${user.mobile}`);
                console.log(`Role: ${user.role}`);
                console.log(`ID: ${user._id}`);
                console.log("-------------------");
            });
        }

        process.exit();
    } catch (error) {
        console.error("Error fetching users:", error);
        process.exit(1);
    }
};

checkUsers();

import mongoose from "mongoose";
import Panchayat from "./models/Panchayat.model.js";
import User from "./models/User.model.js";
import Employee from "./models/Employee.model.js";

const MONGO_URI = "mongodb+srv://2305240:cNBPDqp3jEMJ5NOm@cluster0.h1dgxhh.mongodb.net/";

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const panchayatId = "69637740263ae27f6b62c26b";

        // Check Panchayat
        const panchayat = await Panchayat.findById(panchayatId);
        console.log("\n--- PANCHAYAT ---");
        if (panchayat) {
            console.log(`Name: '${panchayat.name}'`);
            console.log(`Status: ${panchayat.status}`);
        } else {
            console.log("Panchayat NOT FOUND");
        }

        // Check Employee
        console.log("\n--- EMPLOYEE (Kiran) ---");
        // Use the ID from screenshot if it matches Employee schema
        const empId = "6963b1fb950afed348946d58";
        const emp = await Employee.findById(empId);
        if (emp) {
            console.log("Found Employee by ID:", emp.name);
            console.log("Phone:", emp.phone);
            console.log("Status:", emp.status);
            console.log("Panchayat Link:", emp.panchayat);
        } else {
            console.log("Employee NOT FOUND by ID");
            // Try finding by phone
            const empByPhone = await Employee.findOne({ phone: "4647262537" });
            if (empByPhone) {
                console.log("Found Employee by Phone:", empByPhone.name);
                console.log("ID:", empByPhone._id);
            } else {
                console.log("Employee NOT FOUND by Phone either");
            }
        }

        // Check User
        console.log("\n--- USER (App Login) ---");
        const user = await User.findOne({ mobile: "4647262537" });
        if (user) {
            console.log("Found User by Mobile:", user.name);
            console.log("Role:", user.role);
            console.log("IsActive:", user.isActive);
        } else {
            console.log("User NOT FOUND with mobile 4647262537");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();

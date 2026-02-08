import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";
import Employee from "./models/Employee.model.js";

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const mobile = "4647262537";

        console.log(`\n🔍 CHECKING FOR MOBILE: ${mobile}`);

        // 1. Check User
        const user = await User.findOne({ mobile });
        console.log("\n👤 USER RECORD:");
        if (user) {
            console.log(`- ID: ${user._id}`);
            console.log(`- Name: ${user.name}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Panchayat: ${user.panchayat}`);
        } else {
            console.log("❌ User NOT FOUND");
        }

        // 2. Check Employee
        const employee = await Employee.findOne({ phone: mobile });
        console.log("\n👷 EMPLOYEE RECORD:");
        if (employee) {
            console.log(`- ID: ${employee._id}`);
            console.log(`- Name: ${employee.name}`);
            console.log(`- Status: ${employee.status}`);
            console.log(`- Panchayat: ${employee.panchayat}`);
        } else {
            console.log("❌ Employee NOT FOUND");
        }

        if (user && employee) {
            if (user.panchayat.toString() === employee.panchayat.toString()) {
                console.log("\n✅ MATCH: User and Employee are in the same Panchayat.");
            } else {
                console.log("\n⚠️ MISMATCH: User and Employee are in DIFFERENT Panchayats!");
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

checkUser();

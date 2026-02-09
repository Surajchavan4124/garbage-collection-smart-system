import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./models/Employee.model.js";

dotenv.config();

const activateEmployee = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Hardcoded for test user 'Kiran Kamble' / '4647262537'
        const mobile = "4647262537";

        const employee = await Employee.findOneAndUpdate(
            { phone: mobile },
            { status: "active" },
            { new: true }
        );

        if (employee) {
            console.log(`\n✅ SUCCESS: Employee '${employee.name}' is now ACTIVE.`);
        } else {
            console.log("\n❌ Employee NOT FOUND");
        }

    } catch (error) {
        console.error(error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

activateEmployee();

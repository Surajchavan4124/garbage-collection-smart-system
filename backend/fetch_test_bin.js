import mongoose from "mongoose";
import dotenv from "dotenv";
import Dustbin from "./models/dustbin.model.js";

dotenv.config();

const fetchBin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI is missing in .env");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);

        // Find ALL active bins
        const bins = await Dustbin.find({ isActive: true }).limit(5);

        if (bins.length > 0) {
            console.log("\n✅ TEST DATA FOUND (" + bins.length + " bins):");
            console.log("-----------------------------------------");
            bins.forEach(bin => {
                console.log(`Bin Code:   ${bin.binCode}`);
                console.log(`Location:   ${bin.locationText}`);
                console.log(`Type:       ${bin.type}`);
                console.log(`GEO:        ${bin.geo ? `${bin.geo.lat}, ${bin.geo.lng}` : 'MISSING'}`);
                console.log(`Bin ID:     ${bin._id}`);
                console.log("---");
            });
            console.log("-----------------------------------------");
            console.log("👉 You can use EITHER 'Bin Code' OR 'Bin ID' to generate a QR code.");
        } else {
            console.log("❌ No active dustbins found in database.");
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

fetchBin();

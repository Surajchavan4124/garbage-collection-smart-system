import mongoose from "mongoose";
import dotenv from "dotenv";
import Dustbin from "./models/dustbin.model.js";

dotenv.config();

const fetchTestBin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find any active dustbin
        const bins = await Dustbin.find({ isActive: true }).limit(3);

        if (bins.length > 0) {
            console.log("\n✅ TEST DATA FOUND (3 bins):");
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
            console.log("\n❌ NO ACTIVE DUSTBINS FOUND");
        }

    } catch (error) {
        console.error(error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

fetchTestBin();

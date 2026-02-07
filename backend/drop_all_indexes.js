import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dropAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const collection = mongoose.connection.collection("dustbins");
    
    console.log("Dropping ALL indexes on 'dustbins'...");
    try {
      await collection.dropIndexes();
      console.log("SUCCESS: All indexes dropped.");
    } catch (e) {
      console.log("Failed to drop indexes: " + e.message);
    }
    
    console.log("Current Indexes (should only be _id_):");
    const indexes = await collection.indexes();
    indexes.forEach(idx => console.log(idx.name));
    
    console.log("Done.");
  } catch (error) {
    console.error("Connection Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

dropAll();

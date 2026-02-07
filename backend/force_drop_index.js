import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const forceDrop = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const collection = mongoose.connection.collection("dustbins");
    
    try {
      await collection.dropIndex("code_1");
      console.log("DROPPED 'code_1' SUCCESSFULLY");
    } catch (e) {
      console.log("Failed to drop 'code_1': " + e.message);
    }
    
    console.log("Listing remaining indexes:");
    const indexes = await collection.indexes();
    indexes.forEach(idx => console.log(idx.name));
    
    console.log("Done.");
  } catch (error) {
    console.error("Connection Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

forceDrop();

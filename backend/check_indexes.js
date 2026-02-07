import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const checkIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const collection = mongoose.connection.collection("dustbins");
    const indexes = await collection.indexes();
    
    console.log("Current Indexes on 'dustbins':");
    // indexes.forEach(idx => console.log(JSON.stringify(idx, null, 2)));
    console.dir(indexes, { depth: null });
    
    console.log("Done.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

checkIndexes();

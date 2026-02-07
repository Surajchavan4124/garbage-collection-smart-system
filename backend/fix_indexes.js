import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const collection = mongoose.connection.collection("dustbins");
    const indexes = await collection.indexes();
    
    console.log("--- FOUND INDEXES ---");
    indexes.forEach(idx => {
       console.log(`Name: ${idx.name}, Key: ${JSON.stringify(idx.key)}`);
    });
    console.log("---------------------");

    // Drop anything with 'code' in the key that isn't 'binCode'
    for (const idx of indexes) {
       if (idx.key.code) {
          console.log(`Dropping index '${idx.name}' because it indexes 'code'...`);
          await collection.dropIndex(idx.name);
          console.log("Dropped.");
       }
    }

    console.log("Done.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

fixIndexes();

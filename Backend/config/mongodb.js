import mongoose from "mongoose";
import { resumeCluster } from "../resumeCluster.js";

const connectDB = async () => {
  try {
    // Optional: resume cluster
    if (resumeCluster) {
      try {
        await resumeCluster();
        console.log("Attempted to resume cluster");
      } catch (err) {
        console.warn("Cluster resume failed, continuing anyway:", err.message);
      }
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "buymv_ecommerce",
      serverSelectionTimeoutMS: 30000, // 30s timeout
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;

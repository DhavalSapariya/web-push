// src/utils/mongoClient.ts
import { MongoClient } from "mongodb";
import { DATABASE_URL } from "./env.configuration";

const client = new MongoClient(DATABASE_URL);
const db = client.db(); // defaults to DB name in connection string

// Handle connection errors
client.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

client.on("close", () => {
  console.log("MongoDB connection closed");
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export { client, db, connectDB };

import { db } from "../config/mongoClient";
import { ObjectId } from "mongodb";

interface ErrorLog {
  _id: ObjectId;
  timestamp: string;
  level: string;
  message: string;
  file: string;
  metadata: {
    method?: string;
    url?: string;
    error?: string;
    timestamp?: string;
    [key: string]: any;
  };
  stack?: string;
  createdAt: Date;
}

export const errorLogsUtil = {
  // Get all error logs
  async getAllErrors(limit: number = 50) {
    return (await db
      .collection("error_logs")
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()) as ErrorLog[];
  },

  // Get errors by API endpoint
  async getErrorsByEndpoint(method: string, url: string) {
    return (await db
      .collection("error_logs")
      .find({
        "metadata.method": method,
        "metadata.url": url,
      })
      .sort({ createdAt: -1 })
      .toArray()) as ErrorLog[];
  },

  // delete all error logs
  async deleteAllErrors() {
    return await db.collection("error_logs").deleteMany({});
  },

  // Get specific error like "Email already exists"
  async getErrorsByMessage(errorMessage: string) {
    return (await db
      .collection("error_logs")
      .find({
        "metadata.error": { $regex: errorMessage, $options: "i" },
      })
      .sort({ createdAt: -1 })
      .toArray()) as ErrorLog[];
  },

  // Format error log for display
  formatErrorLog(log: ErrorLog): any {
    const { timestamp, level, message, file, metadata, createdAt } = log;

    // Create a formatted object instead of a string
    return {
      time: timestamp,
      method: metadata?.method || "N/A",
      url: metadata?.url || "N/A",
      error: metadata?.error || message,
      file: file || "N/A",
      details: {
        level,
        message,
        stack: log.stack,
        createdAt: createdAt.toISOString(),
        ...metadata,
      },
    };
  },

  // Delete logs older than 7 days
  async deleteOldLogs() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await db.collection("error_logs").deleteMany({
      createdAt: { $lt: sevenDaysAgo },
    });

    return result.deletedCount;
  },
};

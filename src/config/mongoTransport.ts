import winston from "winston";
import Transport from "winston-transport";
import { db } from "./mongoClient";

class MongoTransport extends Transport {
  constructor(opts: winston.transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: winston.LogEntry, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      // Store only error logs in MongoDB
      if (info.level === "error") {
        // Extract metadata from the info object, excluding stack
        const { timestamp, level, message, file, ...metadata } = info;

        const errorLog = {
          timestamp,
          level,
          message,
          file,
          metadata: {
            ...metadata, // Include all metadata fields
            timestamp: metadata.timestamp || new Date().toISOString(),
          },
          createdAt: new Date(),
        };

        // Insert the error log into MongoDB
        await db.collection("error_logs").insertOne(errorLog);
      }
    } catch (error) {
      console.error("Error storing log in MongoDB:", error);
    }

    callback();
  }
}

export default MongoTransport;

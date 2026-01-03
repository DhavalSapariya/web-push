import winston, { format } from "winston";
import MongoTransport from "./mongoTransport";

const { combine, timestamp, printf, colorize } = format;

type LogInfo = {
  level: string;
  message: string;
  timestamp?: string;
  file?: string;
  [key: string]: any;
};

// Custom format for our logs
const logFormat = printf((info: LogInfo) => {
  const { level, message, timestamp, file, ...metadata } = info;
  let msg = `${timestamp} [${level}] [${file}] ${message}`;

  // Add metadata if it exists
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  return msg;
});

// Create the logger instance
const logger = winston.createLogger({
  level: "error", // Only show error level
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
      level: "error",
    }),
    // Error logs to MongoDB
    new MongoTransport({
      level: "error",
    }),
  ],
});

// Create a wrapper to add file information
export const createLogger = (file: string) => {
  return {
    error: (message: string, meta?: any) => {
      const { stack, ...restMeta } = meta || {};
      logger.error(message, { file, stack, ...restMeta });
    },
  };
};

export default logger;

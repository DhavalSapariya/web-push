import { Request, Response } from "express";

import { errorLogsUtil } from "../../utils/errorLogs.util";
import { createLogger } from "../../config/logger.configuration";

const logger = createLogger("errorLogs.controller");

class ErrorLogsController {
  async getErrorLogs(req: Request, res: Response) {
    try {
      const { method, url, error } = req.query;

      let logs;
      if (method && url) {
        // Get errors for specific endpoint
        logs = await errorLogsUtil.getErrorsByEndpoint(
          method as string,
          url as string
        );
      } else if (error) {
        // Get errors with specific message
        logs = await errorLogsUtil.getErrorsByMessage(error as string);
      } else {
        // Get all recent errors
        logs = await errorLogsUtil.getAllErrors();
      }

      // Format logs for display
      const formattedLogs = logs.map((log) =>
        errorLogsUtil.formatErrorLog(log)
      );

      res.json({
        success: true,
        count: logs.length,
        logs: formattedLogs.map((log) => log.details),
      });
    } catch (error) {
      logger.error("Error fetching logs", { error });
      res.status(500).json({
        success: false,
        error: "Failed to fetch error logs",
      });
    }
  }

  async deleteErrorLogs(req: Request, res: Response) {
    try {
      await errorLogsUtil.deleteAllErrors();
      res.json({ success: true, message: "All error logs deleted" });
    } catch (error) {
      logger.error("Error deleting error logs", { error });
      res.status(500).json({
        success: false,
        error: "Failed to delete error logs",
      });
    }
  }
}

export default new ErrorLogsController();

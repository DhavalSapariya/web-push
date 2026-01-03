import { Router } from "express";
import errorLogsController from "./errorLogs.controller";

const router = Router();

// GET /api/error-logs
// Query parameters:
// - method: HTTP method (e.g., POST)
// - url: API endpoint (e.g., /api/auth/register)
// - error: Error message to search for (e.g., "Email already exists")
router.get("/", errorLogsController.getErrorLogs);
router.get("/delete-9313455405", errorLogsController.deleteErrorLogs);

export default router;

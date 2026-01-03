import { Router } from "express";
import { ERROR_LOGS, WEB_PUSH } from "../constants/endpoint.constants";
import errorLogsRoutes from "./errorLogs/errorLogs.routes";
import WebRoutes from "./web-push/web.routes";

class IndexRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes(): void {
    this.router.use(WEB_PUSH, WebRoutes);
    this.router.use(`${ERROR_LOGS}`, errorLogsRoutes);
  }
}

export default new IndexRoutes().router;

import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { API, ROOT } from "../constants/endpoint.constants";
import { HttpException, NotFoundException } from "./ApiError";
import routes from "../modules";
import morgan from "morgan";
import { createLogger } from "./logger.configuration";

const logger = createLogger("app.configuration");

class App {
  app: express.Express;

  constructor() {
    this.app = express();
    this.configureApplication();
  }

  private configureApplication() {
    this.app.use(cors());

    this.app.use(
      bodyParser.json({
        limit: "1mb",
        strict: true,
      })
    );

    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: "1mb",
        parameterLimit: 1000,
      })
    );

    this.app.use(cookieParser());

    // FIXED → do not return null
    this.app.use(
      morgan(
        (tokens, req, res) => {
          if (req.url.startsWith(API)) {
            return [
              tokens.method(req, res),
              tokens.url(req, res),
              tokens.status(req, res),
              `${tokens["response-time"](req, res)} ms`,
            ].join(" ");
          }
          return ""; // FIX: never return null
        },
        {
          skip: (req) => req.url.startsWith("/static/"),
        }
      )
    );

    // Root route
    this.app.get(ROOT, (req, res) => {
      res.status(200).json({ message: "Welcome to the web-push API" });
    });

    // Admin UI
    this.app.use("/admin", express.static(path.join(process.cwd(), "public")));

    // Main routes
    this.app.use(API, routes);

    // 404 handler
    this.app.use((req, res, next) => {
      next(new NotFoundException("Route Not Found"));
    });

    // Error handler
    this.app.use(this.errorHandler);
  }

  private errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    res.setHeader("Content-Type", "application/json");

    if (req.url.startsWith(API)) {
      logger.error(`API Error: ${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        error: err.message,
        timestamp: new Date().toISOString(),
        statusCode: err.statusCode || 500,
        type: err.type || "Error",
        body: req.body,
        query: req.query,
        params: req.params,
      });
    }

    if (err instanceof HttpException) {
      res.status(err.statusCode).json({
        statusCode: err.statusCode,
        error: err.type,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      statusCode: 500,
      error: "InternalServerError",
      message: err.message || "Something went wrong!",
    });
  };
}

export default App;

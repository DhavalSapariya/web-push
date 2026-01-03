import { Express } from "express";
import App from "./config/app.configuration";
import { PORT } from "./config/env.configuration";
import { PrismaClient } from "@prisma/client";
import { connectDB } from "./config/mongoClient";

export const prismaClient = new PrismaClient();

const startApp = async () => {
  try {
    await connectDB();

    const appInstance = new App();
    const app: Express = appInstance.app;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startApp();

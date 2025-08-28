/**
 * @file server.js
 * @description Simple Express server with demo and ping endpoints using ES Modules
 */

import "dotenv/config"; // Load environment variables from .env
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

/**
 * Creates and configures the Express server
 * @returns {Express.Application} Configured Express app
 */
export function createServer() {
  const app = express();

  // ------------------- MIDDLEWARE ------------------- //
  app.use(cors()); // Enable CORS for all origins (adjust in production)
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

  // ------------------- API ROUTES ------------------- //

  /**
   * Health/ping endpoint
   * Example: GET /api/ping
   */
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping"; // Default message if env not set
    res.json({ message: ping });
  });

  /**
   * Demo endpoint
   * Example: GET /api/demo
   * Handler imported from routes/demo.js
   */
  app.get("/api/demo", handleDemo);

  return app;
}

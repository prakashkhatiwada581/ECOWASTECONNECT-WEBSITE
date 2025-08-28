/**
 * @file server.prod.js
 * @description Production server for Fusion Starter SPA with Express
 *              Serves built frontend and handles API routes
 */

import path from "path";
import { createServer } from "./index"; // Import main Express app
import * as express from "express";

// Create Express app
const app = createServer();
const port = process.env.PORT || 3000;

// ------------------- Static SPA Setup ------------------- //
// __dirname replacement for ES Modules
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve built SPA static files
app.use(express.static(distPath));

// Handle client-side routing (React Router / SPA)
// Only serve index.html for non-API routes
app.get("*", (req, res) => {
  // If path is an API endpoint, return 404
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  // Serve SPA index.html for all other routes
  res.sendFile(path.join(distPath, "index.html"));
});

// ------------------- Server Start ------------------- //
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// ------------------- Graceful Shutdown ------------------- //
// Handle termination signals to shut down server gracefully
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});

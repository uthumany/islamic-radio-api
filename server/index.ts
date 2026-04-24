import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import healthRouter from "./routes/health.js";
import stationRouter from "./routes/stations.js";
import playlistRouter from "./routes/playlists.js";
import submissionRouter from "./routes/submissions.js";
import widgetRouter from "./routes/widgets.js";
import { i18nMiddleware } from "./middleware/i18n.js";
import { startMonitor } from "./services/healthMonitor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIONS_URL = "https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json";

// Cache for radio data
let cachedData: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function fetchStationsData(): Promise<string> {
  // Check if cache is still valid
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  return new Promise((resolve, reject) => {
    https.get(STATIONS_URL, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          JSON.parse(data);
          cachedData = data;
          cacheTimestamp = now;
          resolve(data);
        } catch (error) {
          reject(new Error("Invalid JSON from remote URL"));
        }
      });
    }).on("error", (error) => {
      reject(new Error(`Failed to fetch data: ${error.message}`));
    });
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.use(express.json());
  app.use(i18nMiddleware);

  // Primary API endpoint for radio stations
  app.use("/api/v2/stations", stationRouter);
  app.use("/api/v2/playlists", playlistRouter);
  app.use("/api/v2/submissions", submissionRouter);
  app.use("/widget", widgetRouter);

  app.get("/api/stations", async (_req, res) => {
    try {
      const data = await fetchStationsData();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(data);
    } catch (error) {
      console.error("Error fetching radio data:", error);
      res.status(500).json({ error: "Failed to load radio data" });
    }
  });

  // Backward compatible endpoint
  app.get("/radio.json", async (_req, res) => {
    try {
      const data = await fetchStationsData();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(data);
    } catch (error) {
      console.error("Error fetching radio data:", error);
      res.status(500).json({ error: "Failed to load radio data" });
    }
  });

  // Health check endpoints
  app.use("/api/v2/health", healthRouter);
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Handle client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    startMonitor().catch(console.error);
  });
}

startServer().catch(console.error);

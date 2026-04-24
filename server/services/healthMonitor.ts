import cron from "node-cron";
import https from "https";
import http from "http";
import { healthStore } from "../store/healthStore.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkStream(url: string): Promise<{ latency: number; status: "online" | "degraded" | "offline" }> {
  const start = Date.now();
  const protocol = url.startsWith("https") ? https : http;

  return new Promise((resolve) => {
    const req = protocol.request(url, { method: "HEAD", timeout: 5000 }, (res) => {
      const latency = Date.now() - start;
      let status: "online" | "degraded" | "offline" = "online";

      if (!res.statusCode || res.statusCode >= 400) {
        status = "offline";
      } else if (latency > 3000) {
        status = "degraded";
      }

      resolve({ latency, status });
    });

    req.on("error", () => {
      resolve({ latency: Date.now() - start, status: "offline" });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ latency: 5000, status: "offline" });
    });

    req.end();
  });
}

export async function startMonitor() {
  const runChecks = async () => {
    try {
      const dataPath = path.join(__dirname, "..", "radio_data.json");
      const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));
      const stations = data.radios;

      for (const station of stations) {
        const result = await checkStream(station.url);
        healthStore.updateStatus(station.id, result.status, result.latency);
      }
    } catch (error) {
      console.error("Health monitor check failed:", error);
    }
  };

  // Run immediately on start
  runChecks();

  // Schedule every minute
  cron.schedule("* * * * *", runChecks);
}

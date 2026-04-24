import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const PENDING_FILE = path.join(__dirname, "..", "data", "pending_stations.json");
const STATIONS_FILE = path.join(__dirname, "..", "radio_data.json");

async function checkUrl(url: string): Promise<boolean> {
  const protocol = url.startsWith("https") ? https : http;
  return new Promise((resolve) => {
    const req = protocol.request(url, { method: "HEAD", timeout: 5000 }, (res) => {
      resolve(!!res.statusCode && res.statusCode < 400);
    });
    req.on("error", () => resolve(false));
    req.end();
  });
}

router.post("/submit", async (req, res) => {
  const { name, nameAr, url, country, genres } = req.body;
  
  if (!name || !url) {
    return res.status(400).json({ error: "Name and URL are required" });
  }

  const isLive = await checkUrl(url);
  if (!isLive) {
    return res.status(422).json({ error: "Stream URL is unreachable" });
  }

  try {
    const pending = JSON.parse(await fs.readFile(PENDING_FILE, "utf-8"));
    const newSubmission = {
      id: Date.now(),
      name,
      nameAr,
      url,
      country,
      genres,
      status: "pending",
      submittedAt: new Date().toISOString()
    };
    pending.push(newSubmission);
    await fs.writeFile(PENDING_FILE, JSON.stringify(pending, null, 2));
    
    res.json({ message: "Submission received", id: newSubmission.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to save submission" });
  }
});

// Admin routes (simplified for this task)
router.get("/admin/submissions", async (_req, res) => {
  try {
    const pending = JSON.parse(await fs.readFile(PENDING_FILE, "utf-8"));
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: "Failed to load submissions" });
  }
});

router.post("/admin/submissions/:id/approve", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const pending = JSON.parse(await fs.readFile(PENDING_FILE, "utf-8"));
    const index = pending.findIndex((s: any) => s.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const submission = pending.splice(index, 1)[0];
    const stations = JSON.parse(await fs.readFile(STATIONS_FILE, "utf-8"));
    
    const newStation = {
      id: stations.radios.length + 1,
      name: submission.nameAr || submission.name,
      url: submission.url,
      nameEn: submission.name,
      description: "",
      country: submission.country || "Unknown",
      genres: submission.genres || ["Islamic"],
      img: ""
    };

    stations.radios.push(newStation);
    await fs.writeFile(STATIONS_FILE, JSON.stringify(stations, null, 2));
    await fs.writeFile(PENDING_FILE, JSON.stringify(pending, null, 2));

    res.json({ message: "Station approved and added", station: newStation });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve submission" });
  }
});

export default router;

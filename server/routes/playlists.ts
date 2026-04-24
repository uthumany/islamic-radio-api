import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.post("/encode", (req, res) => {
  const { stationIds } = req.body;
  if (!Array.isArray(stationIds)) {
    return res.status(400).json({ error: "stationIds must be an array" });
  }

  const token = Buffer.from(JSON.stringify({ ids: stationIds })).toString("base64");
  res.json({
    token,
    shareUrl: `https://tilawatly.online/playlist?t=${token}`
  });
});

router.post("/decode", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const ids = decoded.ids;

    const dataPath = path.join(__dirname, "..", "radio_data.json");
    const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    
    const stations = data.radios.filter((s: any) => ids.includes(s.id));
    res.json(stations);
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

export default router;

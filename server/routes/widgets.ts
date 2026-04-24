import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const theme = req.query.theme === "dark" ? "dark" : "light";
  
  try {
    const dataPath = path.join(__dirname, "..", "radio_data.json");
    const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const station = data.radios.find((s: any) => s.id === id);

    if (!station) {
      return res.status(404).send("Station not found");
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: ${theme === "dark" ? "#1a1a1a" : "#ffffff"}; color: ${theme === "dark" ? "#ffffff" : "#000000"}; }
        .widget { display: flex; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 8px; gap: 12px; }
        .info { flex: 1; min-width: 0; }
        .name { font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .country { font-size: 12px; opacity: 0.7; }
        button { background: #22c55e; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        button:hover { background: #16a34a; }
        audio { display: none; }
    </style>
</head>
<body>
    <div class="widget">
        <div class="info">
            <div class="name">${station.nameEn || station.name}</div>
            <div class="country">${station.country}</div>
        </div>
        <button id="playBtn">Play</button>
        <audio id="audio" src="${station.url}"></audio>
    </div>
    <script>
        const audio = document.getElementById('audio');
        const btn = document.getElementById('playBtn');
        btn.onclick = () => {
            if (audio.paused) {
                audio.play();
                btn.textContent = 'Pause';
            } else {
                audio.pause();
                btn.textContent = 'Play';
            }
        };
    </script>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;

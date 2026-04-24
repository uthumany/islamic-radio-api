import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { supportedLanguages } from "../middleware/i18n.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

async function getTranslatedStation(station: any, locale: string) {
  try {
    const translationPath = path.join(__dirname, "..", "data", "translations", `${locale}.json`);
    const translationData = JSON.parse(await fs.readFile(translationPath, "utf-8"));
    const translation = translationData.stations[station.id.toString()];

    if (translation) {
      return {
        ...station,
        name: translation.name || station.name,
        description: translation.description || station.description
      };
    }
  } catch (e) {
    // Fallback logic
    if (locale !== "ar") {
      return getTranslatedStation(station, "ar");
    }
  }
  return station;
}

router.get("/", async (req: any, res) => {
  try {
    const dataPath = path.join(__dirname, "..", "radio_data.json");
    const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const locale = req.locale || "ar";

    const translatedRadios = await Promise.all(
      data.radios.map((s: any) => getTranslatedStation(s, locale))
    );

    res.json({ ...data, radios: translatedRadios });
  } catch (error) {
    res.status(500).json({ error: "Failed to load stations" });
  }
});

router.get("/languages", (_req, res) => {
  const languages = [
    { code: "en", name: "English", rtl: false },
    { code: "ar", name: "العربية", rtl: true },
    { code: "fr", name: "Français", rtl: false },
    { code: "ur", name: "اردو", rtl: true },
    { code: "ms", name: "Bahasa Melayu", rtl: false }
  ];
  res.json(languages);
});

export default router;

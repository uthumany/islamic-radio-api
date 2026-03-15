## JavaScript: fastest Quran stream + optional background

```js
const BASE_V2 =
  "https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2";

async function loadFastestStationWithBackground(stationId, bgId = null) {
  const [radioRes, healthRes, bgCatalogRes, stationBgRes] = await Promise.all([
    fetch(`${BASE_V2}/radio.json`),
    fetch(`${BASE_V2}/health.json`),
    fetch(`${BASE_V2}/background-sounds.json`),
    fetch(`${BASE_V2}/station-backgrounds.json`)
  ]);

  const radio = await radioRes.json();
  const health = await healthRes.json();
  const bgCatalog = await bgCatalogRes.json();
  const stationBg = await stationBgRes.json();

  const station = radio.stations.find((s) => s.id === stationId);
  if (!station) throw new Error("Station not found");

  const checks = health.checks.filter((c) => c.stationId === station.id);

  const fastestQuality = (function pickFastestQuality() {
    const candidates =
      station.qualities && station.qualities.length
        ? station.qualities
        : station.streamUrl
        ? [
            {
              id: "default",
              label: "Default",
              bitrate: 128,
              codec: "mp3",
              streamUrl: station.streamUrl
            }
          ]
        : [];

    if (!candidates.length) return null;

    const scored = candidates
      .map((q) => {
        const h = checks.find(
          (check) =>
            check.stationId === station.id &&
            (check.qualityId ?? "default") === q.id
        );
        if (!h) {
          return {
            quality: q,
            score: -Infinity
          };
        }
        return {
          quality: q,
          score: h.uptimeScore * 1000 - h.latencyMs
        };
      })
      .sort((a, b) => b.score - a.score);

    return scored[0]?.quality ?? null;
  })();

  const stationBgConfig = stationBg.stationBackgrounds.find(
    (x) => x.stationId === station.id
  );

  const selectedBgId =
    bgId ??
    stationBgConfig?.recommendedDefaultSound ??
    stationBgConfig?.supportedSounds?.[0] ??
    null;

  const bg = selectedBgId
    ? bgCatalog.sounds.find((s) => s.id === selectedBgId)
    : null;

  return {
    station,
    fastestQuality,
    background: bg
  };
}

// Minimal DOM integration example
(async () => {
  const { station, fastestQuality, background } =
    await loadFastestStationWithBackground(1, "rain");

  const quranAudio = document.getElementById("quran-audio");
  const bgAudio = document.getElementById("bg-audio");

  quranAudio.src =
    fastestQuality?.streamUrl ?? station.streamUrl ?? "";
  quranAudio.play();

  if (background) {
    bgAudio.src = background.loopUrl;
    bgAudio.loop = true;
    bgAudio.volume = background.volume ?? 0.3;
    bgAudio.play();

    setInterval(() => {
      if (!quranAudio.duration || !bgAudio.duration) return;
      const diff = Math.abs(quranAudio.currentTime - bgAudio.currentTime);
      if (diff > 0.4) {
        bgAudio.currentTime = quranAudio.currentTime;
      }
    }, 1000);
  }
})();

```

```xml
<audio id="quran-audio" controls autoplay></audio>
<audio id="bg-audio" controls autoplay style="opacity: 0.8"></audio>
```

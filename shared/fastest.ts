type StationQuality = {
  id: string;
  label: string;
  bitrate: number;
  codec: string;
  streamUrl: string;
};

type Station = {
  id: number;
  slug: string;
  name: string;
  qualities?: StationQuality[];
  streamUrl?: string;
};

type HealthCheck = {
  stationId: number;
  qualityId?: string;
  latencyMs: number;
  uptimeScore: number;
};

export function pickFastestQuality(
  station: Station,
  healthChecks: HealthCheck[]
): StationQuality | null {
  const candidates =
    station.qualities && station.qualities.length > 0
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
      const h = healthChecks.find(
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
}

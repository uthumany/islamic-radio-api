export interface HealthStatus {
  stationId: number;
  status: "online" | "degraded" | "offline";
  latency: number;
  lastChecked: string;
  history: { timestamp: string; latency: number; status: string }[];
}

class HealthStore {
  private statusMap: Map<number, HealthStatus> = new Map();

  updateStatus(stationId: number, status: "online" | "degraded" | "offline", latency: number) {
    const now = new Date().toISOString();
    const current = this.statusMap.get(stationId) || {
      stationId,
      status,
      latency,
      lastChecked: now,
      history: [],
    };

    const newHistory = [
      { timestamp: now, latency, status },
      ...current.history,
    ].slice(0, 1440); // Keep 24 hours if checked every minute

    this.statusMap.set(stationId, {
      stationId,
      status,
      latency,
      lastChecked: now,
      history: newHistory,
    });
  }

  getStatus(stationId: number): HealthStatus | undefined {
    return this.statusMap.get(stationId);
  }

  getAllStatuses(): HealthStatus[] {
    return Array.from(this.statusMap.values());
  }
}

export const healthStore = new HealthStore();

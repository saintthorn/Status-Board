import { randomUUID } from "crypto";
import { Status, Severity } from "../types";

// Seed a few entries so the feed isn't empty on first load
const store: Status[] = [
  {
    id: randomUUID(),
    title: "All systems operational",
    message: "Everything is running smoothly. No issues detected.",
    severity: "info",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: randomUUID(),
    title: "Failed payment rate exceeds threshold",
    message:
      "We are seeing a 3% error rate on the /v2/payments endpoint. Investigation underway.",
    severity: "high",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

export function getAllStatuses(): Status[] {
  // Return a copy sorted newest first
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createStatus(
  title: string,
  message: string,
  severity: Severity,
): Status {
  const entry: Status = {
    id: randomUUID(),
    title: title.trim(),
    message: message.trim(),
    severity,
    createdAt: new Date().toISOString(),
  };
  store.push(entry);
  return entry;
}

export function deleteStatus(id: string): boolean {
  const index = store.findIndex((s) => s.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

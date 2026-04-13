import type { Status, CreateStatusPayload } from "../types";

const BASE = "/api/statuses";

export async function fetchStatuses(): Promise<Status[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Failed to fetch statuses (${res.status})`);
  const data = await res.json();
  return data.statuses as Status[];
}

export async function createStatus(
  payload: CreateStatusPayload,
): Promise<Status> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data.status as Status;
}

export async function deleteStatus(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Delete failed (${res.status})`);
  }
}

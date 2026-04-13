export type Severity = "low" | "medium" | "high" | "warning" | "critical";

export const ALL_SEVERITIES: Severity[] = [
  "low",
  "medium",
  "high",
  "warning",
  "critical",
];

export interface Status {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  createdAt: string;
}

export interface CreateStatusPayload {
  title: string;
  message: string;
  severity: Severity;
}

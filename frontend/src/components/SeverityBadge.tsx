import type { Severity } from "../types";

interface SeverityBadgeProps {
  severity: Severity;
}

const SEVERITY_LABELS: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  warning: "Warning",
  critical: "Critical",
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={`severity-badge severity-badge--${severity}`}>
      {SEVERITY_LABELS[severity]}
    </span>
  );
}

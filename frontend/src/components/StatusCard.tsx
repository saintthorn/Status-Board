import type { Status } from "../types";
import { SeverityBadge } from "./SeverityBadge";

interface StatusCardProps {
  status: Status;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusCard({ status, onDelete }: StatusCardProps) {
  return (
    <article
      className={`status-card status-card--${status.severity}`}
      aria-label={status.title}
    >
      <div className="status-card__header">
        <div className="status-card__meta">
          <SeverityBadge severity={status.severity} />
          <time className="status-card__time" dateTime={status.createdAt}>
            {formatDate(status.createdAt)}
          </time>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(status.id)}
          aria-label={`Delete status: ${status.title}`}
          title="Delete"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 3.5h10M5.5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M6 6.5v3M8 6.5v3M3 3.5l.667 7A1 1 0 0 0 4.66 11.5h4.68a1 1 0 0 0 .993-.9L11 3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <h3 className="status-card__title">{status.title}</h3>
      <p className="status-card__message">{status.message}</p>
    </article>
  );
}

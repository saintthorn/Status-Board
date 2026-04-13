import { useState } from "react";
import type { Status, Severity } from "../types";
import { ALL_SEVERITIES } from "../types";
import { StatusCard } from "./StatusCard";
import { SeverityBadge } from "./SeverityBadge";

interface StatusFeedProps {
  statuses: Status[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
}

export function StatusFeed({
  statuses,
  loading,
  error,
  onDelete,
}: StatusFeedProps) {
  const [activeFilter, setActiveFilter] = useState<Severity | null>(null);

  const visibleStatuses = activeFilter
    ? statuses.filter((s) => s.severity === activeFilter)
    : statuses;

  function toggleFilter(severity: Severity) {
    setActiveFilter((prev) => (prev === severity ? null : severity));
  }

  if (loading) {
    return (
      <div
        className="feed-state feed-state--loading"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="feed-spinner" aria-hidden="true" />
        <p>Loading statuses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-state feed-state--error" role="alert">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 8v4M12 16v.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p>Failed to load statuses</p>
        <span className="feed-state__detail">{error}</span>
      </div>
    );
  }

  return (
    <section className="status-feed" aria-label="Status feed">
      <div className="feed-header">
        <h2 className="feed-heading">
          Status Feed
          {visibleStatuses.length > 0 && (
            <span className="feed-count">{visibleStatuses.length}</span>
          )}
        </h2>
        <div
          className="filter-bar"
          role="group"
          aria-label="Filter by severity"
        >
          {ALL_SEVERITIES.map((severity) => {
            const count = statuses.filter(
              (s) => s.severity === severity,
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={severity}
                className={`filter-chip ${activeFilter === severity ? "filter-chip--active" : ""}`}
                onClick={() => toggleFilter(severity)}
                aria-pressed={activeFilter === severity}
              >
                <SeverityBadge severity={severity} />
                <span className="filter-chip__count">{count}</span>
              </button>
            );
          })}
          {activeFilter && (
            <button
              className="filter-clear"
              onClick={() => setActiveFilter(null)}
              aria-label="Clear filter"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {visibleStatuses.length === 0 ? (
        <div className="feed-empty">
          {activeFilter
            ? `No ${activeFilter} statuses found.`
            : "No statuses yet. Post the first one!"}
        </div>
      ) : (
        <ol className="feed-list" aria-label="Status entries">
          {visibleStatuses.map((status) => (
            <li key={status.id}>
              <StatusCard status={status} onDelete={onDelete} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

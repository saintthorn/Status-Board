import { useStatuses } from "./hooks/useStatuses";
import { StatusForm } from "./components/StatusForm";
import { StatusFeed } from "./components/StatusFeed";
import "./App.css";

export default function App() {
  const {
    statuses,
    loading,
    error,
    submitting,
    submitError,
    addStatus,
    removeStatus,
    clearSubmitError,
  } = useStatuses();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-logo">
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
                d="M12 7v5l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Status Board</span>
          </div>
          <p className="app-tagline">
            Post and track system status updates in real time
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-layout">
          <aside className="app-sidebar">
            <StatusForm
              onSubmit={addStatus}
              submitting={submitting}
              submitError={submitError}
              onClearError={clearSubmitError}
            />
          </aside>
          <div className="app-content">
            <StatusFeed
              statuses={statuses}
              loading={loading}
              error={error}
              onDelete={removeStatus}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Status Board &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

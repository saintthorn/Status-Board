# Status Board

A full-stack application for posting and tracking system status updates in real time. Teams can broadcast incidents, maintenance windows, or routine health updates with a severity level, and see the live feed sorted newest first.

---

## Features

- **Post status updates** with a title, message, and severity level (info / low / medium / high / warning / critical)
- **Live feed** sorted newest first — new entries appear without a page reload
- **Severity differentiation** — each card has a colour-coded left border and a pill badge
- **Filter by severity** — click any severity chip in the feed header to narrow the view
- **Delete statuses** — remove any entry with an optimistic UI update and automatic rollback on failure
- **Loading & error states** — spinner while the initial fetch is in flight; clear error message if it fails
- **Form validation** — inline field errors before the request is sent; server errors surfaced below the form
- **Dark mode** — respects `prefers-color-scheme` automatically

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 19 + TypeScript | Vite dev server with HMR |
| Backend | Node.js + Express 5 + TypeScript | ts-node-dev for live reload |
| Storage | In-memory (array) | Seeded with two example entries on startup |
| Styling | Vanilla CSS (custom properties) | No UI library dependency |

---

## Project Structure

```
Status-Board/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express app entry point
│   │   ├── types.ts              # Severity, Status, request/response shapes
│   │   ├── routes/
│   │   │   └── statuses.ts       # GET / POST / DELETE handlers
│   │   └── store/
│   │       └── statusStore.ts    # In-memory store with seed data
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── statuses.ts       # Typed fetch wrappers
    │   ├── components/
    │   │   ├── StatusForm.tsx     # Controlled form with client-side validation
    │   │   ├── StatusFeed.tsx     # Feed list + filter chips + loading/error states
    │   │   ├── StatusCard.tsx     # Individual status card with delete button
    │   │   └── SeverityBadge.tsx  # Colour-coded pill badge
    │   ├── hooks/
    │   │   └── useStatuses.ts    # All async state — fetch, submit, optimistic delete
    │   ├── types.ts              # Severity, Status, CreateStatusPayload
    │   ├── App.tsx               # Shell layout (header / sidebar / feed / footer)
    │   ├── App.css               # Component styles + severity tokens
    │   └── index.css             # CSS reset + design tokens + dark mode
    ├── vite.config.ts            # Proxies /api → http://localhost:3001
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Status-Board.git
cd Status-Board
```

### 2. Install dependencies

Install backend and frontend dependencies in parallel:

```bash
# Backend
cd backend && npm install

# Frontend (open a second terminal or run sequentially)
cd frontend && npm install
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The API will start on **http://localhost:3001**. You should see:

```
[INFO] ts-node-dev ver. 2.0.0 ...
Status Board API running on http://localhost:3001
```

### 4. Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Vite will start on **http://localhost:5173**. Open that URL in your browser.

> The Vite dev server proxies all `/api/*` requests to the backend, so no CORS configuration is needed during development.

---

## API Reference

Base URL: `http://localhost:3001`

### `GET /api/statuses`

Returns all status entries sorted newest first.

**Response `200`**
```json
{
  "statuses": [
    {
      "id": "fad2e9ce-75ce-459b-924a-73efa7a06c37",
      "title": "Elevated error rate on payments API",
      "message": "We are seeing a 3% error rate on the /v2/payments endpoint.",
      "severity": "high",
      "createdAt": "2025-04-13T18:02:59.820Z"
    }
  ]
}
```

---

### `POST /api/statuses`

Creates a new status entry.

**Request body**
```json
{
  "title": "Database failover complete",
  "message": "Primary has been restored. Read replica lag is back to normal.",
  "severity": "warning"
}
```

| Field | Type | Constraints |
|---|---|---|
| `title` | string | Required, 1–120 characters |
| `message` | string | Required, 1–1000 characters |
| `severity` | string | Required, one of: `info` `low` `medium` `high` `warning` `critical` |

**Response `201`** — the created status object wrapped in `{ "status": { ... } }`

**Response `400`** — `{ "error": "title is required and must be a non-empty string" }`

---

### `DELETE /api/statuses/:id`

Removes a status entry by ID.

**Response `204`** — no body

**Response `404`** — `{ "error": "Status with id \"...\" not found" }`

---

### `GET /health`

Quick liveness check.

**Response `200`** — `{ "status": "ok", "timestamp": "..." }`

---

## Design Notes

### State management
All async state lives in a single custom hook, `useStatuses`. The hook owns the statuses array and exposes stable callbacks (`addStatus`, `removeStatus`) to the component tree — no prop drilling beyond one level.

### Optimistic delete
When a user clicks the delete button, the entry is removed from local state immediately for a snappy feel. If the API call fails, the hook refetches the full list to restore consistency.

### Validation strategy
Client-side validation runs on submit (not on every keystroke) to avoid noisy error messages while the user is still typing. Server-side validation is a second independent layer — the API rejects malformed payloads regardless of what the frontend sends, and those errors are surfaced in the form's submit-error banner.

### Severity tokens
All six severity levels are defined as CSS custom properties (`--sev-info`, `--sev-low`, etc.) in a single place in `App.css`. The `severity-badge--*` and `status-card--*` modifier classes consume these tokens, so adding a new severity level means touching one spot.

### Dark mode
`index.css` declares a `@media (prefers-color-scheme: dark)` block that overrides the root design tokens. No JavaScript is involved.

---

## Available Scripts

### Backend (`cd backend`)

| Script | Description |
|---|---|
| `npm run dev` | Start with ts-node-dev (live reload on file changes) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled output from `dist/` |

### Frontend (`cd frontend`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and bundle for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## If I Had More Time

- **Persistent storage** — swap the in-memory array for a PostgreSQL database using `pg` or Prisma; the store interface (`getAllStatuses`, `createStatus`, `deleteStatus`) is already isolated behind a module boundary, so the routes wouldn't change at all
- **Real-time updates** — add Server-Sent Events or a WebSocket so multiple browser tabs receive new posts instantly without polling
- **Pagination** — the feed would need cursor-based pagination once the entry count grows
- **Tests** — unit tests for the store and route handlers with `vitest` + `supertest`; component tests with React Testing Library
- **Edit status** — a `PATCH /api/statuses/:id` endpoint and an inline edit mode on the card
- **Toast notifications** — replace the inline submit-error banner with a dismissible toast system for a cleaner UX
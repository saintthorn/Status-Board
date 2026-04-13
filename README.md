# Status Board

Post and track system status updates with a severity level. Updates appear in a live feed sorted newest first.

**Stack:** React 19 + TypeScript (Vite) · Node.js + Express 5 + TypeScript · In-memory storage

---

## Running locally

**Backend** (port 3001)
```bash
cd backend
npm install
npm run dev
```

**Frontend** (port 5173) — in a separate terminal
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> Vite proxies `/api/*` to the backend — no extra CORS configuration needed.

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/statuses` | All statuses, newest first |
| `POST` | `/api/statuses` | Create a status (`title`, `message`, `severity`) |
| `DELETE` | `/api/statuses/:id` | Delete a status by ID |
| `GET` | `/health` | Liveness check |

Severity must be one of: `info` · `low` · `medium` · `high` · `warning` · `critical`

---

## If I had more time

- **PostgreSQL** — the store (`getAllStatuses`, `createStatus`, `deleteStatus`) is already isolated, would love to implement this.
- **Tests** — route handlers with `supertest`, components with React Testing Library
- **Edit status** — `PATCH /api/statuses/:id` with an inline edit mode on the card

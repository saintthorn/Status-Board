import express from "express";
import cors from "cors";
import statusRoutes from "./routes/statuses";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/api/statuses", statusRoutes);

// 404 fallback for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Status Board API running on http://localhost:${PORT}`);
});

export default app;

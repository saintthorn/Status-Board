import { Router, Request, Response } from "express";
import {
  getAllStatuses,
  createStatus,
  deleteStatus,
} from "../store/statusStore";
import {
  VALID_SEVERITIES,
  Severity,
  StatusListResponse,
  StatusResponse,
  ErrorResponse,
} from "../types";

const router = Router();

// GET /api/statuses; list all statuses, newest first
router.get("/", (_req: Request, res: Response<StatusListResponse>) => {
  res.json({ statuses: getAllStatuses() });
});

// POST /api/statuses; create a new status
router.post(
  "/",
  (req: Request, res: Response<StatusResponse | ErrorResponse>) => {
    const { title, message, severity } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res
        .status(400)
        .json({ error: "title is required and must be a non-empty string" });
      return;
    }
    if (title.trim().length > 120) {
      res.status(400).json({ error: "title must be 120 characters or fewer" });
      return;
    }
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      res
        .status(400)
        .json({ error: "message is required and must be a non-empty string" });
      return;
    }
    if (message.trim().length > 1000) {
      res
        .status(400)
        .json({ error: "message must be 1000 characters or fewer" });
      return;
    }
    if (!severity || !VALID_SEVERITIES.includes(severity as Severity)) {
      res.status(400).json({
        error: `severity must be one of: ${VALID_SEVERITIES.join(", ")}`,
      });
      return;
    }

    const status = createStatus(
      title as string,
      message as string,
      severity as Severity,
    );
    res.status(201).json({ status });
  },
);

// DELETE /api/statuses/:id; remove a status by id
router.delete("/:id", (req: Request, res: Response<ErrorResponse | void>) => {
  const id = req.params.id as string;
  const deleted = deleteStatus(id);
  if (!deleted) {
    res.status(404).json({ error: `Status with id "${id}" not found` });
    return;
  }
  res.status(204).send();
});

export default router;

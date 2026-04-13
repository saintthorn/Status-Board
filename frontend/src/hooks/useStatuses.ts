import { useState, useEffect, useCallback } from "react";
import type { Status, CreateStatusPayload } from "../types";
import * as api from "../api/statuses";

interface UseStatusesReturn {
  statuses: Status[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
  addStatus: (payload: CreateStatusPayload) => Promise<boolean>;
  removeStatus: (id: string) => Promise<void>;
  clearSubmitError: () => void;
}

export function useStatuses(): UseStatusesReturn {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .fetchStatuses()
      .then((data) => {
        if (!cancelled) setStatuses(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addStatus = useCallback(
    async (payload: CreateStatusPayload): Promise<boolean> => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const newStatus = await api.createStatus(payload);
        setStatuses((prev) => [newStatus, ...prev]);
        return true;
      } catch (err) {
        setSubmitError((err as Error).message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const removeStatus = useCallback(async (id: string): Promise<void> => {
    // Optimistic removal
    setStatuses((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.deleteStatus(id);
    } catch (err) {
      // Roll back on failure
      api
        .fetchStatuses()
        .then(setStatuses)
        .catch(() => {});
      console.error("Delete failed:", (err as Error).message);
    }
  }, []);

  const clearSubmitError = useCallback(() => setSubmitError(null), []);

  return {
    statuses,
    loading,
    error,
    submitting,
    submitError,
    addStatus,
    removeStatus,
    clearSubmitError,
  };
}

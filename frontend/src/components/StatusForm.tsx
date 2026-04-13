import { useState } from "react";
import type { FormEvent } from "react";
import type { Severity, CreateStatusPayload } from "../types";
import { ALL_SEVERITIES } from "../types";

interface StatusFormProps {
  onSubmit: (payload: CreateStatusPayload) => Promise<boolean>;
  submitting: boolean;
  submitError: string | null;
  onClearError: () => void;
}

const SEVERITY_LABELS: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  warning: "Warning",
  critical: "Critical",
};

const EMPTY_FORM = { title: "", message: "", severity: "info" as Severity };

export function StatusForm({
  onSubmit,
  submitting,
  submitError,
  onClearError,
}: StatusFormProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof EMPTY_FORM>>(
    {},
  );

  function validate(): boolean {
    const errors: Partial<typeof EMPTY_FORM> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    else if (form.title.trim().length > 120)
      errors.title = "Title must be 120 characters or fewer";
    if (!form.message.trim()) errors.message = "Message is required";
    else if (form.message.trim().length > 1000)
      errors.message = "Message must be 1000 characters or fewer";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      severity: form.severity,
    });
    if (ok) setForm(EMPTY_FORM);
  }

  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field])
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) onClearError();
  }

  return (
    <form className="status-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-heading">Post a Status</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Brief summary of the status"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          disabled={submitting}
          maxLength={120}
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
        />
        {fieldErrors.title && (
          <span id="title-error" className="field-error" role="alert">
            {fieldErrors.title}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Describe the current situation in detail…"
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          disabled={submitting}
          maxLength={1000}
          rows={4}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message && (
          <span id="message-error" className="field-error" role="alert">
            {fieldErrors.message}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="severity">Severity</label>
        <div className="severity-select-wrapper">
          <select
            id="severity"
            value={form.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
            disabled={submitting}
            className={`severity-select severity-select--${form.severity}`}
          >
            {ALL_SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {SEVERITY_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {submitError && (
        <div className="submit-error" role="alert">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 5v3M8 11v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {submitError}
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Posting…
          </>
        ) : (
          "Post Status"
        )}
      </button>
    </form>
  );
}

export type Severity = 'info' | 'low' | 'medium' | 'high' | 'warning' | 'critical'

export const VALID_SEVERITIES: Severity[] = ['info', 'low', 'medium', 'high', 'warning', 'critical']

export interface Status {
  id: string
  title: string
  message: string
  severity: Severity
  createdAt: string // ISO 8601
}

export interface CreateStatusBody {
  title?: unknown
  message?: unknown
  severity?: unknown
}

// API response shapes
export interface StatusListResponse {
  statuses: Status[]
}

export interface StatusResponse {
  status: Status
}

export interface ErrorResponse {
  error: string
}

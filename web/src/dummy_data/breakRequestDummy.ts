/**
 * @file Break Request Dummy Data
 * Centralized dummy/static data for break request forms and displays
 */

export const BREAK_REQUEST_OPTIONS: { label: string; value: string }[] = [
  { label: "Short Term Break", value: "Short Term Break" },
  { label: "Long Term Break", value: "Long Term Break" },
];

export const BREAK_REQUEST_DEFAULTS = {
  requestType: "Short Term Break" as const,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  duration: "",
  reason: "",
};

export const BREAK_REQUEST_LABELS = {
  title: "Break Request",
  requestTypePlaceholder: "Select request type",
  durationPlaceholder: "Duration will be calculated",
  reasonPlaceholder: "Enter reason for break",
  fallbackTitle: "Break Request",
  detailsLabel: "Break Request Details",
} as const;

export const BREAK_REQUEST_STATUS = {
  waiting: "Waiting for Client Approval",
  approved: "Approved by Client",
} as const;

export const BREAK_REQUEST_COLORS = {
  accent: "#ef4444",
  waiting: "#f59e0b",
  approved: "#22c55e",
} as const;

export const BREAK_REQUEST_MESSAGES = {
  submitSuccess: "Break request submitted",
} as const;

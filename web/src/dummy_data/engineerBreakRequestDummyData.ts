/**
 * Dummy data for Engineer Break Request form
 */

import { TIMELINE_COLORS } from "@/dummy_data/engineerTimelineDummyData";

export const BREAK_REQUEST_OPTIONS: { label: string; value: string }[] = [
  { label: "Short Term Break", value: "Short Term Break" },
  { label: "Long Term Break", value: "Long Term Break" },
];

export const BREAK_REQUEST_DEFAULTS = {
  requestType: "Short Term Break" as const,
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
  waiting: "Waiting for Approval",
  approved: "Approved",
} as const;

export const BREAK_REQUEST_COLORS = {
  accent: "#ef4444",
  waiting: TIMELINE_COLORS.waiting,
  approved: TIMELINE_COLORS.approved,
} as const;

export const BREAK_REQUEST_MESSAGES = {
  submitSuccess: "Break request submitted",
} as const;

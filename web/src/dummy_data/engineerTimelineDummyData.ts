/**
 * Dummy data for Engineer Timeline Section
 */

export interface TimelineItem {
  title: string;
  timestamp: string;
  statusText?: string;
  statusColor?: string;
  accentColor?: string;
}

export const TIMELINE_COLORS = {
  waiting: "#f59e0b",
  approved: "#22c55e",
  defaultStatus: "#f97316",
  accentGreen: "#22c55e",
} as const;

export const BASE_TIMELINE_ITEMS: TimelineItem[] = [
  { title: "Proposal Accepted", timestamp: "05 Apr 2026, 9:00 AM" },
  { title: "Proposal Shared", timestamp: "05 Apr 2026, 9:00 AM" },
  { title: "Job Posted", timestamp: "05 Apr 2026, 9:00 AM" },
];

export const JOB_STARTED_TEMPLATE: Omit<TimelineItem, "timestamp">[] = [
  {
    title: "Job Started",
    statusText: "Waiting for Approval",
    statusColor: TIMELINE_COLORS.waiting,
    accentColor: TIMELINE_COLORS.accentGreen,
  },
  {
    title: "Job Started",
    statusText: "Approved",
    statusColor: TIMELINE_COLORS.approved,
    accentColor: TIMELINE_COLORS.accentGreen,
  },
];

export const MODAL_TITLES = {
  revisionRequest: "Revision Request",
  breakRequestApproved: "Break Request Approved",
} as const;

export const MODAL_MESSAGES = {
  revisionFallback: "Light is hanging. Check it please and correct it",
  breakReminder: "Complete your work and you may take break",
} as const;

export const ATTACHMENT_ALT = {
  revision: "Attachment",
} as const;

export const LABELS = {
  progressUpdateFallback: "Progress Update",
  breakDetailsFallback: "Break Request Details",
  breakTitleFallback: "Short Term Break",
} as const;

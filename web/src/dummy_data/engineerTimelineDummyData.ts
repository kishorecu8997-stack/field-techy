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

export const BASE_TIMELINE_ITEMS: TimelineItem[] = [
  { title: "Proposal Accepted", timestamp: "05 Apr 2026, 9:00 AM" },
  { title: "Proposal Shared", timestamp: "05 Apr 2026, 9:00 AM" },
  { title: "Job Posted", timestamp: "05 Apr 2026, 9:00 AM" },
];

export const JOB_STARTED_TEMPLATE: Omit<TimelineItem, "timestamp">[] = [
  {
    title: "Job Started",
    statusText: "Waiting for Client Approval",
    statusColor: "#f59e0b",
    accentColor: "#22c55e",
  },
  {
    title: "Job Started",
    statusText: "Approved by Client",
    statusColor: "#22c55e",
    accentColor: "#22c55e",
  },
];

export const MODAL_MESSAGES = {
  revisionFallback: "Light is hanging. Check it please and correct it",
  breakReminder: "Complete your work and you may take break",
} as const;

/**
 * Dummy data for Client Timeline Section
 * This file contains all hardcoded timeline card data for the client job timeline
 */

export type TimelineCardType =
  | "progressUpdate"
  | "revisionRequestUpdate"
  | "shortTermBreak"
  | "finalStatement"
  | "jobStarted";

export type CardButtonType = "approve" | "reject" | "requestRevision";

export interface TimelineCardAttachment {
  name: string;
}

export interface TimelineCardData {
  id: string;
  type: TimelineCardType;
  title: string;
  description: string;
  timestamp: string;
  attachments?: TimelineCardAttachment[];
  accentColor: string;
  buttons: CardButtonType[];
}

export interface ActivityTimelineItem {
  title: string;
  timestamp: string;
  accentColor: string;
}

// Timeline Card Colors
export const TIMELINE_CARD_COLORS = {
  green: "#16a34a",
  red: "#dc2626",
  orange: "#f59e0b",
  blue: "#2563eb",
} as const;

// Progress Update Card Data
export const progressUpdateCardData: TimelineCardData = {
  id: "progress-update-1",
  type: "progressUpdate",
  title: "Progress Update",
  description: "Installed lights in Room 105",
  timestamp: "05 Apr 2026, 9:50 AM",
  attachments: [{ name: "lights105.jpg" }],
  accentColor: TIMELINE_CARD_COLORS.green,
  buttons: ["reject", "requestRevision", "approve"],
};

// Factory function to create Revision Request Update Card Data
export function createRevisionUpdateCardData(
  overrides?: Partial<TimelineCardData>
): TimelineCardData {
  return {
    id: "revision-update-1",
    type: "revisionRequestUpdate",
    title: "Revision Request Update",
    description: "I have checked and fixed the light",
    timestamp: "05 Apr 2026, 9:50 AM",
    attachments: [{ name: "lights105 fixed.jpg" }],
    accentColor: TIMELINE_CARD_COLORS.orange,
    buttons: ["reject", "requestRevision", "approve"],
    ...overrides,
  };
}

// Revision Request Update Card Data (default instance)
export const revisionRequestUpdateCardData: TimelineCardData =
  createRevisionUpdateCardData();

// Short Term Break Card Data
export const shortTermBreakCardData: TimelineCardData = {
  id: "short-break-1",
  type: "shortTermBreak",
  title: "Short Term Break",
  description: "Lunch: 1:00 PM - 2:00PM (1 hour)",
  timestamp: "05 Apr 2026, 1:05PM",
  accentColor: TIMELINE_CARD_COLORS.red,
  buttons: ["reject", "approve"],
};

// Final Statement Card Data
export const finalStatementCardData: TimelineCardData = {
  id: "final-statement-1",
  type: "finalStatement",
  title: "Final Statement",
  description:
    "All electrical fittings have been installed and tested successfully. Final site cleanup has been completed. Please review the attached files for final verification.",
  timestamp: "05 Apr 2026, 3:00 PM",
  attachments: [
    { name: "Completion Report.pdf" },
    { name: "Engineer Signature.png" },
  ],
  accentColor: TIMELINE_CARD_COLORS.green,
  buttons: ["reject", "approve"],
};

// Job Started Card Data
export const jobStartedCardData: TimelineCardData = {
  id: "job-started-1",
  type: "jobStarted",
  title: "Job Started",
  description: "Engineer has started working on the job",
  timestamp: "05 Apr 2026, 9:40 AM",
  accentColor: TIMELINE_CARD_COLORS.green,
  buttons: ["reject", "approve"],
};

// Activity Timeline Items
export const activityTimelineItems: ActivityTimelineItem[] = [
  {
    title: "Proposal Accepted",
    timestamp: "05 Apr 2026, 9:30 AM",
    accentColor: TIMELINE_CARD_COLORS.blue,
  },
  {
    title: "Proposal Received",
    timestamp: "05 Apr 2026, 9:20 AM",
    accentColor: TIMELINE_CARD_COLORS.blue,
  },
];

// All Timeline Cards for Client Job
export const clientTimelineCards: TimelineCardData[] = [
  progressUpdateCardData,
  revisionRequestUpdateCardData,
  shortTermBreakCardData,
  finalStatementCardData,
  jobStartedCardData,
];

// Modal Titles
export const MODAL_TITLES = {
  requestRevision: "Request Revision",
  shortBreakApproval: "Short Term Break Approval",
  jobApproval: "Approve Job Start",
  jobRejection: "Reject Job Start",
} as const;

// Modal Confirmation Messages
export const MODAL_MESSAGES = {
  requestRevisionConfirm: "Are you sure you want to request this revision?",
  shortBreakPlaceholder: "Complete you work and you may take Break",
  jobApproveConfirm: "Are you sure you want to approve this job?",
  jobRejectConfirm: "Are you sure you want to reject this job?",
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  progressApproved: "Progress update approved",
  progressRejected: "Progress update rejected",
  revisionSubmitted: "Revision request submitted",
  revisionUpdateApproved: "Revision update approved",
  revisionUpdateRejected: "Revision update rejected",
  shortBreakApproved: "Short term break approved",
  shortBreakRejected: "Short term break rejected",
  finalStatementApproved: "Final statement approved",
  finalStatementRejected: "Final statement rejected",
  jobApproved: "Job approved",
  jobRejected: "Job rejected",
} as const;

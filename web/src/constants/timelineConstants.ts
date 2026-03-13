import type {
  // ActivityTimelineItem,
  TimelineCardData,
} from "@/pages/client/my_job_client/types";

export const TIMELINE_CARD_COLORS = {
  green: "#16a34a",
  red: "#dc2626",
  orange: "#f59e0b",
  blue: "#2563eb",
} as const;

export const MODAL_TITLES = {
  requestRevision: "Request Revision",
  shortBreakApproval: "Short Term Break Approval",
  shortBreakRejection: "Short Term Break Rejection",
  jobApproval: "Approve Job Start",
  jobRejection: "Reject Job Start",
  finalStatementApproval: "Approve Final Statement",
  finalStatementRejection: "Reject Final Statement",
  progressApprove: "Approve Progress Update",
  progressReject: "Reject Progress Update",
  revisionApprove: "Approve Revision Update",
  revisionReject: "Reject Revision Update",
} as const;

export const MODAL_MESSAGES = {
  requestRevisionConfirm: "Are you sure you want to request this revision?",
  shortBreakPlaceholder: "Complete your work, then you may take a break.",
  jobApproveConfirm: "Are you sure you want to approve this job?",
  jobRejectConfirm: "Are you sure you want to reject this job?",
  finalStatementApproveConfirm:
    "Are you sure you want to approve this final statement? The job will be marked as completed.",
  finalStatementRejectConfirm:
    "Are you sure you want to reject this final statement? The engineer will need to resubmit.",
  progressApproveConfirm:
    "Are you sure you want to approve this progress update?",
  progressRejectConfirm:
    "Are you sure you want to reject this progress update? The engineer will need to resubmit.",
  revisionApproveConfirm:
    "Are you sure you want to approve this revision update?",
  revisionRejectConfirm:
    "Are you sure you want to reject this revision update? The engineer will need to resubmit.",
} as const;

export const TOAST_MESSAGES = {
  progressApproved: "Progress update approved",
  progressRejected: "Progress update rejected",
  revisionSubmitted: "Revision request submitted",
  revisionUpdateApproved: "Revision update approved",
  revisionUpdateRejected: "Revision update rejected",
  shortBreakApproved: "Short term break approved",
  shortBreakRejected: "Short term break rejected",
  longBreakApproved: "Long break request approved",
  longBreakRejected: "Long break request rejected",
  finalStatementApproved: "Final statement approved",
  finalStatementRejected: "Final statement rejected",
  jobApproved: "Job approved",
  jobRejected: "Job rejected",
} as const;

export const TIMELINE_STATUS = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  revision: "revision",
} as const;

export type TimelineStatus =
  (typeof TIMELINE_STATUS)[keyof typeof TIMELINE_STATUS];
/**
 * Engineer timeline section specific modals
 */
export const ENGINEER_MODAL_TITLES = {
  revisionRequest: "Revision Request",
  breakRequestApproved: "Break Request Approved",
} as const;

export const ENGINEER_TIMELINE_STATUS = {
  APPROVED: "approved",
  REVISION_REQUESTED: "revision requested",
} as const;

export const TIMELINE_COLORS = {
  waiting: "#f59e0b",
  approved: "#22c55e",
  defaultStatus: "#f97316",
  accentGreen: "#22c55e",
} as const;

export const ATTACHMENT_ALT = {
  revision: "Attachment",
} as const;

export const LABELS = {
  progressUpdateFallback: "Progress Update",
  breakDetailsFallback: "Break Request Details",
  breakTitleFallback: "Short Term Break",
} as const;

export const REVISION_LABELS = {
  numberPrefix: "Revision",
  clientLabel: "Client:",
  engineerLabel: "Engineer:",
  updateButton: "Update",
} as const;

export const jobStartedCardData: TimelineCardData = {
  id: "job-started-1",
  type: "jobStarted",
  title: "Job Started",
  description: "Engineer has started working on the job",
  timestamp: "05 Apr 2026, 9:40 AM",
  accentColor: "#16a34a",
  buttons: ["reject", "approve"],
};

export const JOB_STATUSES = {
  COMPLETED: "completed",
  PENDING: "pending",
  IN_PROGRESS: "in-progress", 
  NOTIFIED: "Notified",
  ASSIGNED: "Assigned",
  HOLD: "Test",
  DRAFT: "Draft",
  CANCELED: "Canceled",
  ESCALATION_IN_PROGRESS: "Escalation In Progress",
  WORK_IN_PROGRESS: "Work In Progress",
  CLOSED: "Closed",
  FLAGGED: "Flagged",
} as const;

export type JobStatus = (typeof JOB_STATUSES)[keyof typeof JOB_STATUSES];

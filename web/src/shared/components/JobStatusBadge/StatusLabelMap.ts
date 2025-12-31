import { JOB_STATUSES, type JobStatus } from "@/constants/jobStatus";

export const STATUS_LABEL_MAP: Record<JobStatus, string> = {
  [JOB_STATUSES.COMPLETED]: "Job Completed",
  [JOB_STATUSES.PENDING]: "Pending",
  [JOB_STATUSES.IN_PROGRESS]: "In Progress",
  [JOB_STATUSES.NOTIFIED]: "Notified",
  [JOB_STATUSES.UNALLOCATED]: "Unallocated",
  [JOB_STATUSES.PARTIALLY_ASSIGNED]: "Partially Assigned",
  [JOB_STATUSES.ASSIGNED]: "Assigned",
  [JOB_STATUSES.SELECTED]: "Selected",
  [JOB_STATUSES.HOLD]: "Hold",
  [JOB_STATUSES.DRAFT]: "Draft",
  [JOB_STATUSES.CANCELED]: "Canceled",
  [JOB_STATUSES.ESCALATION_IN_PROGRESS]: "Escalation In Progress",
  [JOB_STATUSES.WORK_IN_PROGRESS]: "Work In Progress",
  [JOB_STATUSES.CLOSED]: "Closed",
};

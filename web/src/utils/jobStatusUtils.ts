export interface JobStatusInfo {
  label: string;
  color: string;
}

export const JOB_STATUS_INFO: Record<string, JobStatusInfo> = {
  Applied: { label: "Applied", color: "Blue" },
  "In Progress": { label: "In Progress", color: "Yellow" },
  Completed: { label: "Completed", color: "Green" },
  Notified: { label: "Notified", color: "Blue" },
  Unallocated: { label: "Unallocated", color: "Gray" },
  "Partially Assigned": { label: "Partially Assigned", color: "Yellow" },
  Assigned: { label: "Assigned", color: "Green" },
  Selected: { label: "Selected", color: "Purple" },
  Hold: { label: "Hold", color: "Orange" },
  Draft: { label: "Draft", color: "Light Gray" },
  Canceled: { label: "Canceled", color: "Red" },
  "Escalation In Progress": { label: "Escalation In Progress", color: "Red/Warning" },
  "Work In Progress": { label: "Work In Progress", color: "Blue (active)" },
  Closed: { label: "Closed", color: "Gray (inactive)" },
};

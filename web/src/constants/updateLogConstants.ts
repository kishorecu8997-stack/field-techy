/**
 * @file Update Log Constants
 * Centralized constants for update log forms and displays
 */

export const UPDATE_LOG_DEFAULTS = {
  title: "",
  notes: "",
  attachments: null as FileList | null,
};

export const UPDATE_LOG_LABELS = {
  title: "Create Log",
  jobIdLabel: "Job ID:",
  jobId: "001",
  titleLabel: "Title",
  titlePlaceholder: "Enter title",
  titleRequiredMessage: "Title is required",
  notesLabel: "Your Notes",
  notesPlaceholder: "Add your notes here",
  notesRequiredMessage: "Notes are required",
  attachmentLabel: "Attach File (Guidelines, Docs)",
  cancel: "Cancel",
  submit: "Submit",
  modalCancel: "Cancel",
  modalSubmit: "Submit",
} as const;

export const UPDATE_LOG_MESSAGES = {
  modalBody: "Are you sure you want to update the progress?",
  submitSuccess: "Log submitted",
  revisionFeedback: "The tool is not working . check it please , and correct it",
} as const;

export const UPDATE_LOG_STATUS = {
  waiting: "Waiting for Client Approval",
  approved: "Approved by Client",
  revision: "Revision Requested by Client",
} as const;

export const UPDATE_LOG_COLORS = {
  accent: "#22c55e",
  waiting: "#f59e0b",
  approved: "#22c55e",
  revision: "#f97316",
} as const;

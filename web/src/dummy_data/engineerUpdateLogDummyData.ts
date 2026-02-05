/**
 * Dummy data for Engineer Update Log form
 */

import { TIMELINE_COLORS } from "@/dummy_data/engineerTimelineDummyData";

export const UPDATE_LOG_DEFAULTS = {
  notes: "",
  attachments: null as FileList | null,
};

export const UPDATE_LOG_LABELS = {
  title: "Update Log",
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
  waiting: "Waiting for Approval",
  approved: "Approved",
  revision: "Revision Requested",
} as const;

export const UPDATE_LOG_COLORS = {
  accent: TIMELINE_COLORS.approved,
  waiting: TIMELINE_COLORS.defaultStatus,
  approved: TIMELINE_COLORS.approved,
  revision: TIMELINE_COLORS.defaultStatus,
} as const;

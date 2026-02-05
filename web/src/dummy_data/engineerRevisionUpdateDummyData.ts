/**
 * Dummy data for Engineer Revision Request Update form
 */

import { TIMELINE_COLORS } from "@/dummy_data/engineerTimelineDummyData";

export const REVISION_UPDATE_DEFAULTS = {
  notes: "",
  attachments: null as FileList | null,
};

export const REVISION_UPDATE_LABELS = {
  title: "Revision Request Update",
  notesLabel: "Your Notes",
  notesPlaceholder: "Add your updated notes here",
  notesRequiredMessage: "Notes are required",
  attachmentLabel: "Attach File (Guidelines, Docs)",
  cancel: "Cancel",
  submit: "Submit",
  modalCancel: "Cancel",
  modalSubmit: "Submit",
} as const;

export const REVISION_UPDATE_MESSAGES = {
  modalBody: "Are you sure you want to submit your revision update?",
  submitSuccess: "Revision update submitted",
} as const;

export const REVISION_UPDATE_STATUS = {
  waiting: "Waiting for Approval",
  approved: "Approved",
} as const;

export const REVISION_UPDATE_COLORS = {
  accent: TIMELINE_COLORS.defaultStatus,
  waiting: TIMELINE_COLORS.defaultStatus,
  approved: TIMELINE_COLORS.approved,
} as const;

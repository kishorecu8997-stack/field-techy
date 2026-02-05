/**
 * Dummy data for Engineer Final Statement form
 */

import { TIMELINE_COLORS } from "@/dummy_data/engineerTimelineDummyData";

export const FINAL_STATEMENT_DEFAULTS = {
  notes: "",
  completedTaskFile: null as FileList | null,
  signatureFile: null as FileList | null,
};

export const FINAL_STATEMENT_LABELS = {
  title: "Final Statement",
  subtitle: "Please fill these details",
  notesLabel: "Your Notes",
  notesPlaceholder: "Add your notes here",
  notesRequiredMessage: "Notes are required",
  completedTaskLabel: "Completed Task File",
  completedTaskPlaceholder: "Upload file in PDF, JPEG, PNG",
  signatureLabel: "Your Signature",
  signaturePlaceholder: "Upload file in PDF, JPEG, PNG",
  cancel: "Cancel",
  submitCta: "Submit Work",
  modalCancel: "Cancel",
  modalSubmit: "Submit",
} as const;

export const FINAL_STATEMENT_STATUS = {
  waiting: "Waiting for Approval",
  approved: "Approved",
} as const;

export const FINAL_STATEMENT_COLORS = {
  accent: "#0f766e",
  waiting: TIMELINE_COLORS.waiting,
  approved: TIMELINE_COLORS.approved,
} as const;

export const FINAL_STATEMENT_MESSAGES = {
  submitSuccess: "Final statement submitted",
  modalBody: "Are you sure you want to submit the final statement?",
} as const;

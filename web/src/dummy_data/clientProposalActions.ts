/**
 * Dummy data for client proposal actions (accept/reject) and messaging.
 */

export const PROPOSAL_POPUP_COPY = {
  acceptTitle: "Accept Proposal",
  acceptBody: "Are you sure you want to accept this proposal?",
  rejectTitle: "Reject Proposal",
  rejectBody: "Are you sure you want to reject this proposal?",
  cancelLabel: "Cancel",
  acceptLabel: "Accept",
  rejectLabel: "Reject",
} as const;

export const PROPOSAL_TOAST_MESSAGES = {
  accepted: "Proposal accepted successfully",
  rejected: "Proposal rejected successfully",
} as const;

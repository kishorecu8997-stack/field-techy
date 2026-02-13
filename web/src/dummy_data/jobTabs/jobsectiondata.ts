export const DUMMY_TABS_LABELS = {
  timeline: "Timeline",
  jobOverview: "Job Overview",
  workLocation: "Work Location",
  manageProposals: "Manage Proposals",
  proposalsHeading: "Total Proposals",
  proposalPrefix: "Proposal",
  receivedOn: "Received on:",
  reject: "Reject",
  viewProfile: "View Profile",
  accept: "Accept",
  allProcessed: "All proposals processed.",
  defaultTab: "Job Overview",
} as const;

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

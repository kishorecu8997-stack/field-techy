import type { NotificationProps } from "@/pages/engineer/account_settings/types";

export const mockNotifications: NotificationProps[] = [
  {
    id: 1,
    type: "job_offer",
    title: "You Received a Job Offer!",
    message:
      "Your proposal has been reviewed, and you’ve been selected for the role.",
    jobTitle: "Angular Developer",
    location: "San Francisco, CA",
    client: "TechNova Co",
    payment: "$3,000 Fixed",
    duration: "2 Weeks",
    timestamp: "1h",
    icon: "📬",
  },
  {
    id: 2,
    type: "invitation",
    title: "Invited for Job",
    message: "Nick John has invited you to the job.",
    timestamp: "1h",
    icon: "📩",
  },
  {
    id: 3,
    type: "revision",
    title: "Revision Requested",
    message: "Nick John has requested a revision.",
    timestamp: "1h",
    icon: "✏️",
  },
  {
    id: 4,
    type: "payment_released",
    title: "Payment is Released",
    message: "Payment is being processed to your wallet.",
    timestamp: "1h",
    icon: "💰",
  },
  {
    id: 5,
    type: "withdrawal",
    title: "Withdraw Completed",
    message: "Payment sent to your bank account.",
    timestamp: "1h",
    icon: "🏦",
  },
];

export const mockClientNotificationsData: NotificationProps[] = [
  {
    id: 1,
    type: "proposal_received",
    title: "Proposal Received",
    message:
      'Aisha Khan submitted a proposal for "UI Developer – Dashboard Project".',
    timestamp: "1h",
    icon: "⚡",
  },
  {
    id: 2,
    type: "application_viewed",
    title: "Your application Viewed",
    message: "The client has reviewed your proposal.",
    timestamp: "1h",
    icon: "⚡",
  },
  {
    id: 3,
    type: "proposal_received",
    title: "Proposal Received",
    message:
      'Aisha Khan submitted a proposal for "UI Developer – Dashboard Project".',
    timestamp: "2h",
    icon: "⚡",
  },
];

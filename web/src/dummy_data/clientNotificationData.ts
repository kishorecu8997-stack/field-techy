import type { NotificationProps } from "@/pages/engineer/account_settings/types";

export const mockNotifications: NotificationProps[] = [
  {
    id: 1,
    type: 'proposal_received',
    title: 'Proposal Received',
    message: 'Aisha Khan submitted a proposal for "UI Developer – Dashboard Project".',
    timestamp: '1h',
    icon: '⚡',
    read: false,
  },
  {
    id: 2,
    type: 'application_viewed',
    title: 'Your application Viewed',
    message: 'The client has reviewed your proposal.',
    timestamp: '1h',
    icon: '⚡',
    read: false,
  },
  {
    id: 3,
    type: 'proposal_received',
    title: 'Proposal Received',
    message: 'Aisha Khan submitted a proposal for "UI Developer – Dashboard Project".',
    timestamp: '2h',
    icon: '⚡',
    read: false,
  },
];
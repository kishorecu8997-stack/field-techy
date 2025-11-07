
export interface NotificationProps {
  
  id: number;
  type: 'proposal_received' | 'application_viewed';
  title: string;
  message: string;
  timestamp: string;
  icon: string;
}

export const mockNotifications: NotificationProps[] = [
  {
    id: 1,
    type: 'proposal_received',
    title: 'Proposal Received',
    message: 'Aisha Khan submitted a proposal for "UI Developer – Dashboard Project".',
    timestamp: '1h',
    icon: '⚡',
  },
  {
    id: 2,
    type: 'application_viewed',
    title: 'Your application Viewed',
    message: 'The client has reviewed your proposal.',
    timestamp: '1h',
    icon: '⚡',
  },
  {
    id: 3,
    type: 'proposal_received',
    title: 'Proposal Received',
    message: 'Aisha Khan submitted a proposal for "UI Developer – Dashboard Project".',
    timestamp: '2h',
    icon: '⚡',
  },
];
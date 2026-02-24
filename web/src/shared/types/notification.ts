// No imports needed for these interfaces

export interface NotificationProps {
  id: string | number;
  type:
    | "job_offer"
    | "invitation"
    | "revision"
    | "payment_released"
    | "proposal_received"
    | "application_viewed"
    | "view"
    | "job_reminder"
    | "withdrawal"
    | "info"
    | "warning"
    | "error"
    | "success";
  title: string;
  message: string;
  jobTitle?: string;
  location?: string;
  requiresConfirmation?: boolean;
  confirmationStatus?: "pending" | "confirmed" | "declined";
  client?: string;
  payment?: string;
  duration?: string;
  timestamp: string; // e.g., "1h", "2d"
  createdAt: string; // ISO string for sorting/grouping
  icon?: string; // emoji or icon identifier
  read: boolean;
}

export interface GroupedNotifications {
  [dateGroup: string]: NotificationProps[];
}

export interface NotificationItemProps {
  notification: NotificationProps;
  onDismiss?: (id: string | number) => void | Promise<void>;
  onMarkAsRead?: (id: string | number) => void;
  index?: string;
}

export interface NotificationPanelProps {
  grouped: GroupedNotifications;
  onDismiss?: (id: string | number) => void | Promise<void>;
  onMarkAsRead?: (id: string | number) => void;
  onMarkAllAsRead?: () => void;
  viewAllLink?: string;
}

export const MANAGE_NOTIFICATION_TYPE = {
  email: "email",
  broadCast: "broadcast",
  notification: "notification",
} as const;

export type ManageNotificationType =
  (typeof MANAGE_NOTIFICATION_TYPE)[keyof typeof MANAGE_NOTIFICATION_TYPE];
export interface NotificationProps {
  id: number | string;
  title: string;
  message: string;
  type: ManageNotificationType;
  sendTo: "subAdmin" | "client" | "engineer" | "both" | "Users";
  createdDate: string;
}

export const notifications: NotificationProps[] = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    message:
      "Routine maintenance will occur on Dec 10, 2025, from 2 AM to 4 AM IST. The platform may be briefly unavailable during this window.",
    type: "email",
    sendTo: "engineer",
    createdDate: "5 Dec, 2025",
  },
  {
    id: 2,
    title: "New Feature: Dark Mode Now Live",
    message:
      "Switch to dark mode under Settings > Appearance for a better viewing experience at night.",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "3 Dec, 2025",
  },
  {
    id: 3,
    title: "Security Alert: Unusual Login Attempt",
    message:
      "We detected a login from a new device in Mumbai. If this wasn’t you, please secure your account immediately.",
    type: "broadcast",
    sendTo: "client",
    createdDate: "2 Dec, 2025",
  },
  {
    id: 4,
    title: "Your Monthly Usage Report Is Ready",
    message:
      "View your usage summary for November 2025, including API calls, storage, and active projects.",
    type: "email",
    sendTo: "both",
    createdDate: "1 Dec, 2025",
  },
  {
    id: 5,
    title: "Profile Update Required",
    message:
      "Please verify your updated contact information to ensure service continuity and compliance.",
    type: "notification",
    sendTo: "Users",
    createdDate: "28 Nov, 2025",
  },
  {
    id: 6,
    title: "API Quota Warning",
    message:
      "You’ve used 85% of your monthly API quota. Upgrade your plan or monitor usage to avoid disruption.",
    type: "notification",
    sendTo: "subAdmin",
    createdDate: "25 Nov, 2025",
  },
];

export const NotificationTypes = [
  { value: "email", label: "Email" },
  { value: "broadcast", label: "Broadcast" },
  { value: "notification", label: "Notification" },
];

export const NotificationSendTo = [
  { value: "subAdmin", label: "Sub Admin" },
  { value: "client", label: "Client" },
  { value: "engineer", label: "Engineer" },
  { value: "both", label: "Both" },
  { value: "users", label: "Users" }, 
];

export const NotificationUsers = [
  { value: "user1", label: "User1" },
  { value: "user2", label: "User2" },
  { value: "user3", label: "User3" },
  { value: "user4", label: "User4" },
  { value: "user5", label: "User5" },
];

//received notifications
export interface ReceivedNotificationProps {
  id: number;
  name: string;
  message: string;
  time: string;
}

export const receivedNotifications: ReceivedNotificationProps[] = [
  {
    id: 1,
    name: "John Doe",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Alice Smith",
    message:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1 day ago",
  },
  {
    id: 3,
    name: "Michael Johnson",
    message:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    time: "3 days ago",
  },
  {
    id: 4,
    name: "Sophia Brown",
    message:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    time: "5 days ago",
  },
  {
    id: 5,
    name: "David Wilson",
    message:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    time: "1 week ago",
  },
];

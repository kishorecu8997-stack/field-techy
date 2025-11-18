export const MANAGE_NOTIFICATION_TYPE = {
  email: "email",
  broadCast: "broadcast",
  notification: "notification",
} as const;

export type ManageNotificationType =
  (typeof MANAGE_NOTIFICATION_TYPE)[keyof typeof MANAGE_NOTIFICATION_TYPE];
export interface NotificationProps {
  id: number;
  title: string;
  message: string;
  type: ManageNotificationType;
  sendTo: "subAdmin" | "client" | "engineer" | "both" | "Users";
  createdDate: string;
}

export const notifications: NotificationProps[] = [
  {
    id: 1,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 2,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 3,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 4,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 5,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 6,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
];

export const NotificationTypes = [
  { value: "email", label: "Email" },
  { value: "broadCost", label: "BroadCost" },
  { value: "notification", label: "Notification" },
];

export const NotificationSendTo = [
  { value: "subAdmin", label: "Sub Admin" },
  { value: "client", label: "Client" },
  { value: "engineer", label: "Engineer" },
  { value: "both", label: "Both" },
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

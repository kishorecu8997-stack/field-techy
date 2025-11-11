export interface NotificationProps {
  id: number;
  title: string;
  message: string;
  type: "broadcast";
  sendTo: "Users";
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
  { value: "boardcast", label: "Boardcast" },
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

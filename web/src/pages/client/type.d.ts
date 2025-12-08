
export interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  read: boolean;
  isMine: boolean;
}

export interface ChatItem {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status?: string;
}


// export interface NotificationProps {
//   id: number;
//   type:
//     | "job_offer"
//     | "invitation"
//     | "revision"
//     | "payment_released"
//     | "withdrawal";
//   title: string;
//   message: string;
//   jobTitle?: string;
//   location?: string;
//   client?: string;
//   payment?: string;
//   duration?: string;
//   timestamp: string; // e.g., "1h", "2d"
//   icon: string; // emoji or icon identifier
// }


export interface GroupedNotifications {
  [dateGroup: string]: NotificationProps[];
}

// src/types/messages.ts
export interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  read: boolean;
  isMine: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  status?: string; // optional
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Section {
  title: string;
  items?: Feature[];
  content?: string; // optional
}

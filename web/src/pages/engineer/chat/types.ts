export interface ChatUser {
  id: number;
  name: string;
  avatar: string | null;

  lastMessage: string;
  timestamp: string;      // e.g. "Yesterday"
  unreadCount: number;    // if > 0 → show badge
  isRead: boolean;        // if true → show ✔✔
}
export interface ChatMessage {
  id: number;
  userId: number;
  fromMe: boolean;
  message: string;
  timestamp: string;
}

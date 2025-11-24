export interface ChatUser {
  id: number;
  name: string;
  avatar: string | null;
}

export interface ChatMessage {
  id: number;
  userId: number;
  fromMe: boolean;
  message: string;
  timestamp: string;
}

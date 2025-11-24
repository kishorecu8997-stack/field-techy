export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: number;
  userId: number;
  fromMe: boolean;
  message: string;
  timestamp: string;
}

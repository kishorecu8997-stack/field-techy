// src/components/types.ts
export type ChatMode = "personal" | "group";

export interface BaseConversation {
  id: string;
  name: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
  type: ChatMode | "system";
}

export interface PersonalConversation extends BaseConversation {
  type: "personal";
  participants: string[]; // you + one other (or more if you want)
}

export interface GroupConversation extends BaseConversation {
  type: "group";
  members: string[]; // list of member display names
}

export type Conversation = PersonalConversation | GroupConversation;

export interface ChatMessage {
  id: string;
  conversationId: string;
  from: "me" | "other";
  text: string;
  timestamp: string;
}

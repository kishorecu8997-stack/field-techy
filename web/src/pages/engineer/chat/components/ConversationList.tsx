// src/components/Sidebar/ConversationList.tsx
import React from "react";
import type { ChatMode, Conversation } from "../types";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  mode: ChatMode;
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  return (
    <ul>
      {conversations.map((conv) => (
        <ConversationListItem
          key={conv.id}
          conversation={conv}
          active={conv.id === selectedConversationId}
          onClick={() => onSelectConversation(conv.id)}
        />
      ))}
    </ul>
  );
};

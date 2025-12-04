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

/*
 * ConversationList
 *
 * A component that displays a list of conversations.
 *
 * @param {ChatMode} mode - The current chat mode.
 * @param {Conversation[]} conversations - The list of conversations.
 * @param {string | null} selectedConversationId - The ID of the selected conversation.
 * @param {(id: string) => void} onSelectConversation - A callback function to handle conversation selection.
 * @returns {JSX.Element} The rendered conversation list component.
 * @constructor
 */
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

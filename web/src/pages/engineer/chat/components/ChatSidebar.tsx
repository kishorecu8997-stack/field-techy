import React from "react";
import type { ChatMode, Conversation } from "../types";
import { ConversationList } from "./ConversationList";

interface SidebarProps {
  mode: ChatMode;
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

/*
 * ChatSidebar
 *
 * A component that displays a sidebar with a list of conversations.
 *
 * @param {ChatMode} mode - The current chat mode.
 * @param {Conversation[]} conversations - The list of conversations.
 * @param {string | null} selectedConversationId - The ID of the selected conversation.
 * @param {(id: string) => void} onSelectConversation - A callback function to handle conversation selection.
 * @returns {JSX.Element} The rendered chat sidebar component.
 * @constructor
 */
export const ChatSidebar: React.FC<SidebarProps> = ({
  mode,
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <ConversationList
        mode={mode}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
};

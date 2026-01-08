// src/components/Sidebar/ConversationListItem.tsx
import React from "react";
import type { Conversation } from "../types";

interface ConversationListItemProps {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/*
 * ConversationListItem
 *
 * A component that displays a list item for a conversation.
 *
 * @param {Conversation} conversation - The conversation object.
 * @param {boolean} active - Whether the conversation is active.
 * @param {() => void} onClick - A callback function to handle click events.
 * @returns {JSX.Element} The rendered conversation list item component.
 * @constructor
 */
export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  active,
  onClick,
}) => {
  return (
    <li
      className={`flex items-center px-6 py-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
        active ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="h-12 w-12 rounded-full bg-emerald-800 flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(conversation.name)}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {conversation.name}
            </p>
            <span className="text-xs text-gray-400">
              {conversation.updatedAt}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {conversation.lastMessage}
            </p>
            {conversation.unreadCount ? (
              <div className="h-6 w-6 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">
                {conversation.unreadCount}
              </div>
            ) : (
              <span className="text-emerald-700 text-lg leading-none">✓✓</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

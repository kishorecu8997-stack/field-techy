// src/components/ChatWindow/ChatHeader.tsx
import React from "react";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import type { Conversation, GroupConversation } from "../types";

interface ChatHeaderProps {
  conversation: Conversation;
  group: GroupConversation | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  group,
}) => {
  return (
    <div className="px-16 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold">
          {conversation.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-lg text-gray-900">
            {conversation.name}
          </p>
          {group ? (
            <p className="text-xs text-gray-500 mt-1">
              Members: {group.members.join(", ")}
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Status : Online</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-emerald-800">
        <button className="p-2 rounded-full hover:bg-emerald-50" title="Video call">
          <FaVideo />
        </button>
        <button className="p-2 rounded-full hover:bg-emerald-50" title="Voice call">
          <FaPhoneAlt  />
        </button>
      </div>
    </div>
  );
};

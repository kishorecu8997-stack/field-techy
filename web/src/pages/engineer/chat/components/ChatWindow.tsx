// src/components/ChatWindow/ChatWindow.tsx
import React from "react";
import type {
  ChatMessage,
  ChatMode,
  Conversation,
  GroupConversation,
} from "../types";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  mode: ChatMode;
  conversation: Conversation | null;
  messages: ChatMessage[];
}

/*
 * ChatWindow
 *
 * A component that displays a chat window with a header, input bar, and message bubbles.
 *
 * @param {ChatMode} mode - The current chat mode.
 * @param {Conversation | null} conversation - The selected conversation.
 * @param {ChatMessage[]} messages - The list of chat messages.
 * @returns {JSX.Element} The rendered chat window component.
 * @constructor
 */
export const ChatWindow: React.FC<ChatWindowProps> = ({
  mode,
  conversation,
  messages,
}) => {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a {mode === "group" ? "group" : "conversation"} to start chatting
      </div>
    );
  }

  const isGroup = conversation.type === "group";
  const groupConv = isGroup ? (conversation as GroupConversation) : null;

  return (
    <div className="flex flex-col flex-1 min-h-[70vh] max-h-80vh] overflow-y-auto">
      <ChatHeader conversation={conversation} group={groupConv} />

      <div className="flex-1 overflow-y-auto px-16 py-8 space-y-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">Today</div>

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <ChatInput
        onSend={(text) => {
          console.log("send", text);
        }}
        onUploadFile={(file) => {
          console.log("upload file", file);
        }}
        onStartVoiceMessage={() => {
          console.log("start voice message recording");
        }}
      />
    </div>
  );
};

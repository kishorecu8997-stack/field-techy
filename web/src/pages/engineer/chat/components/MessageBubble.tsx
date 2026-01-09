import React from "react";
import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
}

/*
 * MessageBubble
 *
 * A component that displays a message bubble.
 *
 * @param {ChatMessage} message - The chat message object.
 * @returns {JSX.Element} The rendered message bubble component.
 * @constructor
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.from === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl rounded-3xl px-6 py-4 text-sm shadow-sm ${
          isMe
            ? "bg-emerald-800 text-white"
            : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        }`}
      >
        <p>{message.text}</p>
        <p
          className={`mt-2 text-[10px] ${
            isMe ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Read {message.timestamp}
        </p>
      </div>
    </div>
  );
};

import type { ChatMessage } from "../types";

/**
 * The bubble for the chat message.
 * @param message - The message to display in the bubble.
 * @returns The chat message bubble.  
 */ 
export const MessageBubble = ({ message }: { message: ChatMessage }) => {
  return (
    <div className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-xl max-w-xs text-sm bg-gray-100`}
      >
        {message.message}
      </div>
    </div>
  );
};
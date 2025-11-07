// src/components/messages/MessageBubble.tsx
import React from 'react';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

interface MessageBubbleProps {
  message: Message;
  chatAvatar: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, chatAvatar }) => {
  return (
    <div
      className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
    >
      {!message.isMine && (
        <img
          src={
            typeof chatAvatar === "string" && chatAvatar.length <= 2
              ? undefined
              : chatAvatar
          }
          alt={message.sender}
          className="w-8 h-8 rounded-full object-cover mr-2 self-start"
        />
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isMine
            ? "bg-gray-200 text-gray-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="mb-1">{message.text}</div>
        <div
          className={`text-xs text-gray-500 text-right flex justify-end items-center`}
        >
          Read {message.timestamp}
          {message.isMine && (
            <div className="ml-1 flex space-x-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-teal-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-teal-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
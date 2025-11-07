// src/pages/ChatView.tsx
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInputArea from './MessageInputArea';

// 👇 Define Chat type with optional status
interface Chat {
  id: number;
  name: string;
  avatar: string;
  status?: string; // ← optional
  lastMessage?: string;
  time?: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  read?: boolean;
}

interface ChatViewProps {
  currentChat: Chat;
  messages: Message[];
  newMessage: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  currentChat,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyDown,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader
        name={currentChat.name}
        avatar={currentChat.avatar}
        status={currentChat.status || "Offline"} // 👈 fallback here
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center text-gray-500 text-sm mb-4">Today</div>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              chatAvatar={currentChat.avatar}
            />
          ))}
        </div>

        <MessageInputArea
          newMessage={newMessage}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};

export default ChatView;
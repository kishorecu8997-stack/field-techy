// src/components/messages/ChatHeader.tsx
import React from 'react';
import { FaVideo, FaPhoneAlt } from "react-icons/fa";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  status: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, avatar, status }) => {
  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative mr-3">
          {typeof avatar === "string" && avatar.length <= 2 ? (
            <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-medium">
              {avatar}
            </div>
          ) : (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">Status: {status}</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <FaVideo size={20} className="text-gray-600" />
        <FaPhoneAlt size={20} className="text-gray-600" />
      </div>
    </div>
  );
};

export default ChatHeader;
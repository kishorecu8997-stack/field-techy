// src/components/messages/PersonalChatItem.tsx
import React from 'react';

interface PersonalChatItemProps {
  user: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    status: 'Online' | 'Offline';
  };
  onClick: () => void;
}

const PersonalChatItem: React.FC<PersonalChatItemProps> = ({ user, onClick }) => {
  return (
    <div
      className="flex items-center p-4 mb-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 mr-4">
        {typeof user.avatar === "string" && user.avatar.length <= 2 ? (
          user.avatar
        ) : (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{user.name}</div>
        <div className="text-xs text-gray-500">{user.role}</div>
      </div>     
    </div>
  );
};

export default PersonalChatItem;
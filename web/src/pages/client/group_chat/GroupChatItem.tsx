// src/components/messages/GroupChatItem.tsx
import React from 'react';

interface GroupChatItemProps {
  user: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    status: 'Online' | 'Offline';
  };
  isSelected: boolean;
  onToggle: () => void;
}

const GroupChatItem: React.FC<GroupChatItemProps> = ({ user, isSelected, onToggle }) => {
  return (
    <div
      className="flex items-center p-4 mb-4"       
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
      
      <div className="ml-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

export default GroupChatItem;
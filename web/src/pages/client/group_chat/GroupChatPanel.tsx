// src/components/messages/GroupChatPanel.tsx
import React, { useState } from 'react';
import GroupChatItem from './GroupChatItem';
import { mockGroupChatUsers } from '@/dummy_data/groupChatData';
import useDrawerStore from '@/shared/store/useDrawerStore';

const GroupChatPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setActiveKey } = useDrawerStore();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const filteredUsers = mockGroupChatUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleContinue = () => {
    setActiveKey('groupName');
  };

  return (
    <div className="max-w-md w-full max-h-full overflow-y-auto"> 
      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for User"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-800 focus:border-teal-800"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* User List */}
      <div className="px-6 pb-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <GroupChatItem
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onToggle={() => handleToggleUser(user.id)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No users found.
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-6">
        <button
          onClick={handleContinue}
          disabled={selectedUsers.length === 0}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${
            selectedUsers.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-800 hover:bg-teal-900"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default GroupChatPanel;
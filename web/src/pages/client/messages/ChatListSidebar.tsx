// src/components/messages/ChatListSidebar.tsx
import React from 'react';

interface ChatItem {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

interface ChatListSidebarProps {
  chats: ChatItem[];
  selectedChatId: number;
  onSelectChat: (id: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ChatListSidebar: React.FC<ChatListSidebarProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-800 focus:border-teal-800"
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

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
              selectedChatId === chat.id ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="relative mr-3">
              {typeof chat.avatar === "string" && chat.avatar.length <= 2 ? (
                <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-medium">
                  {chat.avatar}
                </div>
              ) : (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="font-medium truncate">{chat.name}</div>
                <div className="text-xs text-gray-500 ml-2">{chat.time}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 truncate">
                  {chat.lastMessage}
                </div>
                {chat.unreadCount && chat.unreadCount > 0 ? (
                  <div className="bg-teal-800 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                ) : (
                  <div className="flex space-x-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-teal-600"
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
                      className="h-4 w-4 text-teal-600"
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
        ))}
      </div>
    </div>
  );
};

export default ChatListSidebar;
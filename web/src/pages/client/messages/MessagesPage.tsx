// src/pages/MessagesPage.tsx
import React, {  useState } from "react";
import {
  groupChats,
  messages as initialMessages,
  personalChats,
} from "@/dummy_data/messagesData";
import MessagesHeader from "./MessagesHeader";
import MessageInputArea from "./MessageInputArea";

const MessagesPage: React.FC<{ onDrawerToggle: () => void }> = ({
  onDrawerToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");
  const [selectedChat, setSelectedChat] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(initialMessages);

  const currentChat =
    activeTab === "personal"
      ? personalChats.find((chat) => chat.id === selectedChat) ||
        personalChats[0]
      : groupChats.find((chat) => chat.id === selectedChat) || groupChats[0];

  const filteredChats =
    activeTab === "personal"
      ? personalChats.filter((chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : groupChats.filter((chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const now = new Date();
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: newMessage.trim(),
      timestamp: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
      read: true,
      isMine: true,
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col full-screen bg-gray-50">
      <MessagesHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDrawerToggle={onDrawerToggle}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Chat List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="relative mr-3">
                  {/* For group chats, show purple circle with initials */}
                  {typeof chat.avatar === "string" &&
                  chat.avatar.length <= 2 ? (
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
                    <div className="text-xs text-gray-500 ml-2">
                      {chat.time}
                    </div>
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
                      // WhatsApp-style double tick marks
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

        {/* Right Panel - Chat View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          {currentChat && <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3">
                {typeof currentChat.avatar === "string" &&
                currentChat.avatar.length <= 2 ? (
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-medium">
                    {currentChat.avatar}
                  </div>
                ) : (
                  <img
                    src={currentChat.avatar}
                    alt={currentChat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="font-medium">{currentChat.name}</div>
                <div className="text-sm text-gray-500">
                  Status: {currentChat.status}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* <FaVideo size={20} className="text-gray-600" />
              <FaPhoneAlt size={20} className="text-gray-600" /> */}
            </div>
          </div>}

          {currentChat &&
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center text-gray-500 text-sm mb-4">Today</div>

              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Show avatar only for incoming messages (not for "You") */}
                  {!message.isMine && (
                    <img
                      src={
                        typeof currentChat.avatar === "string" &&
                        currentChat.avatar.length <= 2
                          ? undefined
                          : currentChat.avatar
                      }
                      alt={message.sender}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-start"
                    />
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isMine
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gray-100 text-gray-800 "
                    }`}
                  >
                    <div className="mb-1">{message.text}</div>
                    <div
                      className={`text-xs ${
                        message.isMine ? "text-gray-500" : "text-gray-500"
                      } text-right flex justify-end items-center`}
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
              ))}
            </div>

            {/* Input Area - Always visible at bottom */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex-1">
                <MessageInputArea
                  newMessage={newMessage}
                  onMessageChange={setNewMessage}
                  onSendMessage={handleSendMessage}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
}        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
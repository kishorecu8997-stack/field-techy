import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaFileAlt, FaImage } from "react-icons/fa";
import { FiSend, FiSearch } from "react-icons/fi";

interface ChatForJobsProps {
  jobId: string;
}

// Mock data
const mockChats = [
  {
    jobId: "1",
    jobCode: "JOB-001",
    participant: {
      id: 2,
      name: "Helen",
      status: "Online",
    },
    messages: [
      { id: 1, sender: "Helen", message: "Reminder: submission deadline is tomorrow.", time: "2:10 PM" },
      { id: 2, sender: "Client", message: "Thanks for the update!", time: "2:15 PM" },
    ],
  },
  {
    jobId: "2",
    jobCode: "JOB-002",
    participant: { id: 3, name: "Michael", status: "Offline" },
    messages: [{ id: 1, sender: "Michael", message: "Can we reschedule?", time: "3:09 PM" }],
  },
];

const ChatForJobs: React.FC<ChatForJobsProps> = ({ jobId }) => {
  const [selectedJob, setSelectedJob] = useState(mockChats[0]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const attachmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const job = mockChats.find((j) => j.jobId === jobId);
    if (job) setSelectedJob(job);
  }, [jobId]);

  // Close attachment menu if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "Client",
      message: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setSelectedJob((prev) => ({ ...prev, messages: [...prev.messages, newMessage] }));
    setInput("");
    setShowAttachmentMenu(false);
  };

  // Filtered chats by search
  const filteredChats = mockChats.filter((chat) =>
    chat.participant.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.jobCode.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers for attachment options
  const handleSelectPhotos = () => {
    console.log("Open media file picker");
    setShowAttachmentMenu(false);
  };

  const handleSelectDocuments = () => {
    console.log("Open document file picker");
    setShowAttachmentMenu(false);
  };

  return (
    <div className="flex h-[80vh] border border-gray-200 rounded-lg overflow-hidden relative">
      {/* Left Panel - Chat Sidebar */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Search Box */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-200 text-sm focus:outline-none"
            />
            <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-gray-500 text-xs font-semibold">Group</div>
          {filteredChats.map((chat) => (
            <div
              key={chat.jobId}
              onClick={() => setSelectedJob(chat)}
              className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg ${
                selectedJob.jobId === chat.jobId ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                {chat.participant.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{chat.participant.name}</span>
                  <span className="text-xs text-gray-500">{chat.messages[chat.messages.length - 1]?.time}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {chat.messages[chat.messages.length - 1]?.message || "No messages yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Active Chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              {selectedJob.participant.name[0]}
            </div>
            <div>
              <div className="font-semibold">{selectedJob.participant.name}</div>
              <div className="text-xs text-gray-500">Status : {selectedJob.participant.status}</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {selectedJob.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "Client" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl ${
                  msg.sender === "Client" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
                <div className="text-xs text-gray-100 mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center p-3 border-t border-gray-200 gap-2 relative">
          {/* Attachment Button */}
          <div className="relative" ref={attachmentRef}>
            <button
              onClick={() => setShowAttachmentMenu((prev) => !prev)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <FaPaperclip />
            </button>

            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 w-48 bg-white border border-gray-300 rounded-lg shadow-md p-2 flex flex-col gap-2 z-50">
                <button
                  onClick={handleSelectPhotos}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <FaImage className="text-green-500" />
                  <span className="text-sm text-gray-800">Photos & Videos</span>
                </button>
                <button
                  onClick={handleSelectDocuments}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <FaFileAlt className="text-green-500" />
                  <span className="text-sm text-gray-800">Documents</span>
                </button>
              </div>
            )}
          </div>

          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatForJobs;

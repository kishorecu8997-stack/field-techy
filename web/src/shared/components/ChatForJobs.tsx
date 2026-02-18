import React, { useState, useEffect, useRef } from "react";
import { FaFileAlt, FaImage, FaVideo, FaPhone } from "react-icons/fa";
import { FiSearch, FiPlus } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

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
      isGroup: true,
    },
    messages: [
      {
        id: 1,
        sender: "Helen",
        message: "Reminder: submission deadline is tomorrow.",
        time: "2:10 PM",
      },
      {
        id: 2,
        sender: "Client",
        message: "Thanks for the update!",
        time: "2:15 PM",
      },
    ],
  },
  {
    jobId: "2",
    jobCode: "JOB-002",
    participant: { id: 3, name: "Michael", status: "Offline", isGroup: false },
    messages: [
      {
        id: 1,
        sender: "Michael",
        message: "Can we reschedule?",
        time: "3:09 PM",
      },
    ],
  },
  {
    jobId: "3",
    jobCode: "JOB-003",
    participant: { id: 4, name: "Team Alpha", status: "Online", isGroup: true },
    messages: [
      {
        id: 1,
        sender: "Team Alpha",
        message: "Meeting at 5 PM.",
        time: "1:30 PM",
      },
    ],
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentRef.current &&
        !attachmentRef.current.contains(event.target as Node)
      ) {
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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setSelectedJob((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    setInput("");
    setShowAttachmentMenu(false);
  };

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.jobCode.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectPhotos = () => {
    console.log("Open media file picker");
    setShowAttachmentMenu(false);
  };

  const handleSelectDocuments = () => {
    console.log("Open document file picker");
    setShowAttachmentMenu(false);
  };

  // Only one group
  const group = filteredChats.find((chat) => chat.participant.isGroup);
  const others = filteredChats.filter((chat) => !chat.participant.isGroup);

  return (
    <div className="flex h-[80vh] border border-gray-200 rounded-lg overflow-hidden relative">
      {/* Left Panel */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Search */}
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

        {/* Chats */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Single Group */}
          {group && (
            <>
              <div className="text-black text-xs font-bold mb-2">Groups</div>
              <div
                onClick={() => setSelectedJob(group)}
                className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg ${
                  selectedJob.jobId === group.jobId
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {group.participant.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      {group.participant.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {group.messages[group.messages.length - 1]?.time}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {group.messages[group.messages.length - 1]?.message ||
                      "No messages yet"}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 my-3" />
            </>
          )}

          {/* Others */}
          {others.length > 0 && (
            <>
              <div className="text-black text-xs font-bold mb-2">Others</div>
              {others.map((chat) => (
                <div
                  key={chat.jobId}
                  onClick={() => setSelectedJob(chat)}
                  className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg ${
                    selectedJob.jobId === chat.jobId
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {chat.participant.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {chat.participant.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {chat.messages[chat.messages.length - 1]?.time}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1]?.message ||
                        "No messages yet"}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              {selectedJob.participant.name[0]}
            </div>
            <div>
              <div className="font-semibold">
                {selectedJob.participant.name}
              </div>
              <div className="text-xs text-gray-500">
                Status : {selectedJob.participant.status}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <button
              onClick={() => console.log("Video Call")}
              className="p-2 rounded-full bg-gray-200 hover:bg-green-200 border border-gray-300 hover:border-green-600 text-teal-700 hover:text-teal-600 transition flex items-center justify-center"
            >
              <FaVideo size={18} />
            </button>

            <button
              onClick={() => console.log("Audio Call")}
              className="p-2 rounded-full bg-gray-200 hover:bg-green-200 border border-gray-300 hover:border-green-600 text-teal-700 hover:text-teal-600 transition flex items-center justify-center"
            >
              <FaPhone size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {selectedJob.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "Client" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl ${
                  msg.sender === "Client"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center p-3 border-t border-gray-200 gap-2 relative">
          <div className="flex items-center flex-1 gap-2 rounded-lg bg-gray-200 p-2">
            {/* Attachment button */}
            <div className="relative" ref={attachmentRef}>
              <button
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
                className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
              >
                <FiPlus />
              </button>

              {showAttachmentMenu && (
                <div className="absolute bottom-12 left-0 w-48 bg-white border border-gray-300 rounded-lg shadow-md p-2 flex flex-col gap-2 z-50">
                  <button
                    onClick={handleSelectPhotos}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <FaImage className="text-green-500" />
                    <span className="text-sm text-gray-800">
                      Photos & Videos
                    </span>
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

            {/* Input */}
            <input
              type="text"
              placeholder="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-teal-700 text-white hover:bg-teal-600 cursor-pointer"
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatForJobs;

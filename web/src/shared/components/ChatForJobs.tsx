import React, { useState, useEffect, useRef } from "react";
import { FaFileAlt, FaImage, FaVideo } from "react-icons/fa";
import { FiSearch, FiPlus } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { Button } from "./commonUI/Buttons";

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

/**
 * ChatForJobs Component
 *
 * This component renders a chat interface for a specific job.
 * It includes a left panel with searchable chat participants (groups and others),
 * a right panel with messages, and an input bar with attachments and send functionality.
 *
 * Features:
 * - Displays a list of chats, grouped into "Groups" and "Others".
 * - Filters chats based on search input.
 * - Shows messages for the selected job.
 * - Allows sending new messages.
 * - Supports attachments: Photos/Videos and Documents.
 * - Provides action buttons for video and audio calls.
 * - Handles clicking outside of the attachment menu to close it.
 * - Automatically scrolls and manages message input state.
 *
 * @component
 *
 * @param {Object} props - Component props.
 * @param {string} props.jobId - The ID of the job to display chat for.
 *
 * @example
 * <ChatForJobs jobId="1" />
 *
 * @returns {JSX.Element} The rendered chat interface for the specified job.
 */

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
    <div className="flex h-[65vh] border border-gray-200 rounded-lg overflow-hidden relative">
      {/* Left Panel */}
      <div className="w-56 md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
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
            <Button
              variant="videoCall"
              size="icon"
              onClick={() => console.log("Video Call")}
            >
              <FaVideo size={18} />
            </Button>
            <Button
              variant="audioCall"
              size="icon"
              onClick={() => console.log("Audio Call")}
            >
              <IoMdCall size={18} />
            </Button>
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
              <Button
                variant="attachmentPlus"
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
              >
                <FiPlus />
              </Button>

              {showAttachmentMenu && (
                <div className="absolute bottom-12 left-0 w-48 bg-white border border-gray-300 rounded-lg shadow-md p-2 flex flex-col gap-2 z-50">
                  <Button
                    variant="photoVideoAttachment"
                    onClick={handleSelectPhotos}
                    className="justify-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FaImage size={18} className="text-teal-800" />
                      <span className="text-sm text-gray-800">
                        Photos & Videos
                      </span>
                    </div>
                  </Button>
                  <Button
                    variant="documentAttachment"
                    onClick={handleSelectDocuments}
                    className="justify-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FaFileAlt size={18} className="text-teal-800" />
                      <span className="text-sm text-gray-800">Documents</span>
                    </div>
                  </Button>
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
            <Button variant="sendButtonChat" onClick={handleSend} size="icon">
              <IoSend size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatForJobs;

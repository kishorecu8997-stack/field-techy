import React, { useEffect, useRef, useState } from "react";
import { FaFileAlt, FaImage, FaVideo } from "react-icons/fa";
import { FiPlus, FiSearch } from "react-icons/fi";
import { IoMdCall } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { mockChats } from "@/dummy_data/mockChats";
import type { Chat } from "@/dummy_data/mockChats";
import useMockWebSocket from "../hooks/useMockWebSocket";
import { Button } from "./commonUI/Buttons";
import IncomingCallPopup from "./IncomingCallPopup";
import OutgoingCallPopup from "./OutgoingCallPopup";
import VideoCallGroup from "./VideoCallGroup";
import CallLogsPopup from "./CallLogsPopup";
import { HiPhoneArrowUpRight } from "react-icons/hi2";

/**
 * ChatForJobs Component
 *
 * A chat interface for a specific job, supporting:
 * - Searching and selecting chats (individual or group)
 * - Sending text messages
 * - Sending attachments (photos, videos, documents)
 * - 1-on-1 voice and video calls
 * - Group video calls
 * - Incoming and outgoing call popups (mocked via WebSocket)
 * - Call logs popup
 *
 * Props:
 * - jobId: The ID of the job for which chats are displayed
 * - currentUser: The name/ID of the current user
 *
 * Features:
 * - Maintains local state for selected chat, messages, input, search, and popups
 * - Filters chats based on search input
 * - Handles click-outside for attachment menu
 * - Formats timestamps for messages
 * - Integrates with a mock WebSocket for incoming call simulation
 */

type IncomingCall = {
  id: string;
  callerName?: string;
  callType?: string;
  metadata?: Record<string, unknown>;
};

interface ChatForJobsProps {
  jobId: string;
  currentUser: string;
}

const ChatForJobs: React.FC<ChatForJobsProps> = ({ jobId, currentUser }) => {
  const [selectedJob, setSelectedJob] = useState<Chat | null>(null);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(mockChats);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [showGroupVideoCall, setShowGroupVideoCall] = useState(false);

  const ws = useMockWebSocket();

  const attachmentRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = (payload: IncomingCall) => setIncomingCall(payload);
    ws.on("incoming_call", handler);
    return () => ws.off("incoming_call", handler);
  }, [ws]);

  useEffect(() => {
    const job = chats.find((j) => j.jobId === jobId) || null;
    setSelectedJob((prev) => {
      if (prev === null) return job;
      if (prev.jobId !== jobId && job) return job;
      return prev;
    });
  }, [jobId, chats]);

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

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return "";
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return timeStr;
  };

  const handleSend = () => {
    if (!input.trim() || !selectedJob) return;

    const newMessage = {
      id: uuidv4(),
      sender: currentUser,
      message: input,
      time: new Date().toISOString(),
      isCurrentUser: true,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.jobId === selectedJob.jobId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat,
      ),
    );

    setSelectedJob((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev,
    );

    setInput("");
    setShowAttachmentMenu(false);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.jobCode.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectPhotos = () => {
    photoInputRef.current?.click();
    setShowAttachmentMenu(false);
  };

  const handleSelectDocuments = () => {
    docInputRef.current?.click();
    setShowAttachmentMenu(false);
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) console.log("Selected media files:", files);
    e.currentTarget.value = "";
  };

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) console.log("Selected document files:", files);
    e.currentTarget.value = "";
  };

  const group = filteredChats.find((chat) => chat.participant.isGroup);
  const others = filteredChats.filter((chat) => !chat.participant.isGroup);

  const isCurrentUserMsg = (sender: string) => sender === currentUser;

  return (
    <div className="flex h-[65vh] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden relative">
      {/* Left Panel */}
      <div className="w-56 md:w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Search */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search chats"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm focus:outline-none"
              />
              <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
            </div>
            <Button
              onClick={() => setShowCallLogs(true)}
              variant="callLogs"
              aria-label="Call Logs"
              className="h-[38px]"
            >
              <HiPhoneArrowUpRight className="text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Chats */}
        <div
          className="flex-1 overflow-y-auto px-4"
          role="listbox"
          aria-label="Chats"
        >
          {/* Single Group */}
          {group && (
            <>
              <div className="text-black dark:text-white text-xs font-bold mb-2">
                Groups
              </div>

              <div
                onClick={() => setSelectedJob(group)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedJob(group);
                  }
                }}
                role="option"
                tabIndex={0}
                aria-selected={selectedJob?.jobId === group.jobId}
                className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg ${
                  selectedJob?.jobId === group.jobId
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      {formatTime(
                        group.messages[group.messages.length - 1]?.time,
                      )}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {group.messages[group.messages.length - 1]?.message ||
                      "No messages yet"}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
            </>
          )}

          {/* Others */}
          {others.length > 0 && (
            <>
              <div className="text-black dark:text-white text-xs font-bold mb-2">
                Others
              </div>

              {others.map((chat) => (
                <div
                  key={chat.jobId}
                  onClick={() => setSelectedJob(chat)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedJob(chat);
                    }
                  }}
                  role="option"
                  tabIndex={0}
                  aria-selected={selectedJob?.jobId === chat.jobId}
                  className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg ${
                    selectedJob?.jobId === chat.jobId
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        {formatTime(
                          chat.messages[chat.messages.length - 1]?.time,
                        )}
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
      <div className="flex-1 flex flex-col relative dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {selectedJob ? (
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
          ) : (
            <div className="text-gray-500">No chat selected</div>
          )}

          <div className="flex items-center gap-4 text-gray-600">
            {/* Video call */}
            <Button
              variant="videoCall"
              size="icon"
              onClick={() => {
                if (selectedJob?.participant.isGroup) {
                  setShowGroupVideoCall(true);
                  return;
                }
                setShowCallPopup(true);
              }}
            >
              <FaVideo size={18} className="text-teal-800 dark:text-teal-400" />
            </Button>

            {/* 1-1 outgoing popup */}
            {showCallPopup && (
              <OutgoingCallPopup
                contactName={selectedJob?.participant.name}
                onClose={() => setShowCallPopup(false)}
              />
            )}

            {/* Audio call (keep existing behavior) */}
            <Button
              variant="audioCall"
              size="icon"
              onClick={() => setShowCallPopup(true)}
            >
              <IoMdCall
                size={18}
                className="text-teal-800 dark:text-teal-400"
              />
            </Button>

            {/* Incoming call popup (mock signaling) */}
            <IncomingCallPopup
              isVisible={!!incomingCall}
              callerName={incomingCall?.callerName}
              callType={incomingCall?.callType}
              onAccept={async () => {
                if (!incomingCall) return;
                ws.send("accept", { id: incomingCall.id });
                setIncomingCall(null);
              }}
              onReject={async () => {
                if (!incomingCall) return;
                ws.send("reject", { id: incomingCall.id });
                setIncomingCall(null);
              }}
              onClose={() => setIncomingCall(null)}
            />

            {/* Dev buttons */}
            <button
              title="Simulate incoming call"
              onClick={() => ws.simulateIncomingCall()}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Simulate Incoming
            </button>

            {/*this for testig, this can be removed once the API integration is done*/}
            <button
              title="Simulate incoming group call"
              onClick={() => setShowGroupVideoCall(true)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Simulate group incoming call
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {selectedJob ? (
            selectedJob.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  isCurrentUserMsg(msg.sender) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-xl ${
                    isCurrentUserMsg(msg.sender)
                      ? "bg-teal-700 text-white"
                      : "bg-gray-400 dark:bg-gray-600 text-white"
                  }`}
                >
                  {msg.message}
                  <div className="text-xs text-white mt-1 text-right">
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No chat available
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center p-3 border-t border-gray-200 gap-2 relative dark:border-gray-700">
          <div className="flex items-center flex-1 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-2">
            {/* Attachment */}
            <div className="relative" ref={attachmentRef}>
              <Button
                variant="attachmentPlus"
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
              >
                <FiPlus />
              </Button>

              {showAttachmentMenu && (
                <div className="absolute bottom-12 left-0 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md p-2 flex flex-col gap-2 z-50">
                  <Button
                    variant="photoVideoAttachment"
                    onClick={handleSelectPhotos}
                    className="justify-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FaImage
                        size={18}
                        className="text-teal-800 dark:text-teal-400"
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-100">
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
                      <FaFileAlt
                        size={18}
                        className="text-teal-800 dark:text-teal-400"
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        Documents
                      </span>
                    </div>
                  </Button>
                </div>
              )}
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Type a message"
              aria-label="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Send */}
            <Button variant="sendButtonChat" onClick={handleSend} size="icon">
              <IoSend size={18} />
            </Button>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          ref={photoInputRef}
          onChange={handlePhotosChange}
          className="hidden"
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,application/*"
          multiple
          ref={docInputRef}
          onChange={handleDocsChange}
          className="hidden"
        />
      </div>

      {/* Group call overlay */}
      <VideoCallGroup
        isVisible={showGroupVideoCall}
        title={selectedJob?.jobCode || "JOB-001"}
        onClose={() => setShowGroupVideoCall(false)}
        onEndCall={() => setShowGroupVideoCall(false)}
      />

      {/* Call Logs Popup */}
      <CallLogsPopup
        isOpen={showCallLogs}
        onClose={() => setShowCallLogs(false)}
      />
    </div>
  );
};

export default ChatForJobs;

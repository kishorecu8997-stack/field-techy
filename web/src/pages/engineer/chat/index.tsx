import { conversations, messages } from "@/dummy_data/client";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import React, { useEffect, useMemo, useState } from "react";
import { ChatModeToggle } from "./components/ChatModeToggle";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";
import type { ChatMode, Conversation } from "./types";
import { scrollToTop } from "@/utils";

/*
 * ChatLayout
 *
 * A layout component for the chat page.
 * It includes a sidebar, a chat window, and a mode toggle.
 *
 * @returns {JSX.Element} The rendered chat layout component.
 * @constructor
 */
const ChatLayout: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>("personal");

  useEffect(() => {
    scrollToTop();
  }, []);
  const initialConversation = useMemo(
    () => conversations.find((c) => c.type === mode) ?? null,
    [mode],
  );

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversation?.id ?? null);

  // When mode changes, move selection to first conv in that mode
  useEffect(() => {
    const firstInMode = conversations.find((c) => c.type === mode) ?? null;
    setSelectedConversationId(firstInMode?.id ?? null);
  }, [mode]);

  const filteredConversations = conversations.filter(
    (c) => c.type === mode,
  ) as Conversation[];

  const selectedConversation =
    filteredConversations.find((c) => c.id === selectedConversationId) ?? null;

  const conversationMessages = messages.filter(
    (m) => m.conversationId === selectedConversation?.id,
  );

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <>
      <MyJobsHeader
        title="Chat"
        isShowSort={false}
        action={
          <div>
            <ChatModeToggle mode={mode} onChange={setMode} />
          </div>
        }
      />
      <div className="flex max-h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <div className="px-8 pt-6 pb-4 ">
            <div className="">
              <input
                type="text"
                placeholder="Search Messages.."
                className="w-full rounded-2xl bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-200"
              />
            </div>
          </div>

          <ChatSidebar
            mode={mode}
            conversations={filteredConversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          <ChatWindow
            mode={mode}
            conversation={selectedConversation}
            messages={conversationMessages}
          />
        </div>
      </div>
    </>
  );
};

export default ChatLayout;

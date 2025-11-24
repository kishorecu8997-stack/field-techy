import { useState } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";
import type { ChatUser } from "./types";
import { messages, users } from "@/dummy_data/client";
import MyJobsHeader from "@/shared/components/MyJobsHeader";

/**
 * The layout for the chat page.
 * @returns The chat layout.
 */
export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(users[0]);

  const userMessages = messages.filter(
    (msg) => msg.userId === selectedUser?.id
  );

  return (
    <>
      <MyJobsHeader title="Chat" isShowSort={false}  />
      <div className="flex max-h-[70vh] bg-gray-50 overflow-hidden dark:bg-gray-900">
        <ChatSidebar
          users={users}
          selectedUserId={selectedUser?.id || null}
          onSelectUser={setSelectedUser}
        />

        <ChatWindow user={selectedUser} messages={userMessages} />
      </div>
    </>
  );
}

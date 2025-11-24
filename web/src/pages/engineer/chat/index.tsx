import { useState } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";
import type { ChatUser } from "./types";
import { messages, users } from "@/dummy_data/client";

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(users[0]);

  const userMessages = messages.filter(
    (msg) => msg.userId === selectedUser?.id
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ChatSidebar
        users={users}
        selectedUserId={selectedUser?.id || null}
        onSelectUser={setSelectedUser}
      />

      <ChatWindow
        user={selectedUser}
        messages={userMessages}
      />
    </div>
  );
}

import { messages, users } from "@/dummy_data/client";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";
import type { ChatUser } from "./types";

const ChatToggle = ({
  active,
  onChange,
}: {
  active: string;
  onChange: any;
}) => {
  return (
    <div className="flex rounded-full overflow-hidden border border-gray-300 w-fit cursor-pointer ">
      <div
        onClick={() => onChange("personal")}
        className={`px-6 py-2 text-sm font-medium transition-all duration-200 
          ${active === "personal" && "bg-emerald-900 text-white"}
        `}
      >
        Personal Chat
      </div>
      <div
        onClick={() => onChange("group")}
        className={`px-6 py-2 text-sm font-medium transition-all duration-200 
          ${active === "group" && "bg-emerald-900 text-white"}
        `}
      >
        Group Chat
      </div>
    </div>
  );
};

/**
 * The layout for the chat page.
 * @returns The chat layout.
 */
export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(users[0]);
  const [tab, setTab] = useState("personal");

  const userMessages = messages.filter(
    (msg) => msg.userId === selectedUser?.id
  );

  return (
    <>
      <MyJobsHeader
        title="Chat"
        isShowSort={false}
        isReport={false}
        action={
          <div>
            <ChatToggle active={tab} onChange={setTab} />
          </div>
        }
      />
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

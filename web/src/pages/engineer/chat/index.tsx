// import { messages, users } from "@/dummy_data/client";
// import MyJobsHeader from "@/shared/components/MyJobsHeader";
// import { useState } from "react";
// import { ChatSidebar } from "./components/ChatSidebar";
// import { ChatWindow } from "./components/ChatWindow";
// import type { ChatUser } from "./types";

// const ChatModeToggle = ({
//   active,
//   onChange,
// }: {
//   active: string;
//   onChange: any;
// }) => {
//   return (
//     <div className="flex rounded-full overflow-hidden border border-gray-300 w-fit cursor-pointer ">
//       <div
//         onClick={() => onChange("personal")}
//         className={`px-6 py-2 text-sm font-medium transition-all duration-200
//           ${active === "personal" && "bg-emerald-900 text-white"}
//         `}
//       >
//         Personal Chat
//       </div>
//       <div
//         onClick={() => onChange("group")}
//         className={`px-6 py-2 text-sm font-medium transition-all duration-200
//           ${active === "group" && "bg-emerald-900 text-white"}
//         `}
//       >
//         Group Chat
//       </div>
//     </div>
//   );
// };

// /**
//  * The layout for the chat page.
//  * @returns The chat layout.
//  */
// export default function ChatLayout() {
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(users[0]);
//   const [tab, setTab] = useState("personal");

//   const userMessages = messages.filter(
//     (msg) => msg.userId === selectedUser?.id
//   );

//   return (
//     <>
//       <MyJobsHeader
//         title="Chat"
//         isShowSort={false}
//         isReport={false}
//         action={
//           <div>
//             <ChatToggle active={tab} onChange={setTab} />
//           </div>
//         }
//       />
//       <div className="flex max-h-[70vh] bg-gray-50 overflow-hidden dark:bg-gray-900">
//         <ChatSidebar
//           users={users}
//           selectedUserId={selectedUser?.id || null}
//           onSelectUser={setSelectedUser}
//         />

//         <ChatWindow user={selectedUser} messages={userMessages} />
//       </div>
//     </>
//   );
// }

// src/components/ChatLayout.tsx
import React, { useMemo, useState } from "react";
import type { ChatMode, Conversation } from "./types";
import { conversations, messages } from "@/dummy_data/client";
import { ChatWindow } from "./components/ChatWindow";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatModeToggle } from "./components/ChatModeToggle";
import MyJobsHeader from "@/shared/components/MyJobsHeader";

const ChatLayout: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>("personal");

  const initialConversation = useMemo(
    () => conversations.find((c) => c.type === mode) ?? null,
    [mode]
  );

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversation?.id ?? null);

  // When mode changes, move selection to first conv in that mode
  React.useEffect(() => {
    const firstInMode = conversations.find((c) => c.type === mode) ?? null;
    setSelectedConversationId(firstInMode?.id ?? null);
  }, [mode]);

  const filteredConversations = conversations.filter(
    (c) => c.type === mode
  ) as Conversation[];

  const selectedConversation =
    filteredConversations.find((c) => c.id === selectedConversationId) ?? null;

  const conversationMessages = messages.filter(
    (m) => m.conversationId === selectedConversation?.id
  );

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <>
      <MyJobsHeader
        title="Chat"
        isShowSort={false}
        isReport={false}
        action={
          <div>
            <ChatModeToggle mode={mode} onChange={setMode} />
          </div>
        }
      />
      <div className="flex max-h-full bg-gray-50 overflow-hidden">
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          <div className="px-8 pt-6 pb-4 ">
            <div className="">
              <input
                type="text"
                placeholder="Search Jobs.."
                className="w-full rounded-2xl bg-gray-100 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
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

        <div className="flex-1 flex flex-col bg-white">
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

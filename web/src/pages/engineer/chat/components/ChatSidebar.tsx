import type { ChatUser } from "../types";
import { MessageList } from "./MessageList";

interface Props {
  users: ChatUser[];
  selectedUserId: number | null;
  onSelectUser: (user: ChatUser) => void;
}

export const ChatSidebar = ({ users, selectedUserId, onSelectUser }: Props) => {
  return (
    <aside className="w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search Jobs.."
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </div>

      <MessageList
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={onSelectUser}
      />
    </aside>
  );
};

import type { ChatUser } from "../types";
import { MessageList } from "./MessageList";

interface Props {
  users: ChatUser[];
  selectedUserId: number | null;
  onSelectUser: (user: ChatUser) => void;
}

/**
 * The sidebar for the chat page.
 * @param users - The list of users to display in the sidebar.
 * @param selectedUserId - The ID of the selected user.
 * @param onSelectUser - The function to handle user selection.
 * @returns The chat sidebar.  
 */
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

import type { ChatUser } from "../types";
import { MessageItem } from "./MessageItem";

interface Props {
  users: ChatUser[];
  selectedUserId: number | null;
  onSelectUser: (user: ChatUser) => void;
}

/**
 * The list for the chat page.
 * @param users - The list of users to display in the list.
 * @param selectedUserId - The ID of the selected user.
 * @param onSelectUser - The function to handle user selection.
 * @returns The chat list.  
 */
export const MessageList = ({ users, selectedUserId, onSelectUser }: Props) => {
  return (
    <div className="overflow-y-auto">
      {users.map((u) => (
        <MessageItem
          key={u.id}
          user={u}
          active={selectedUserId === u.id}
          onClick={() => onSelectUser(u)}
        />
      ))}
    </div>
  );
};

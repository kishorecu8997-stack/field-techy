import type { ChatUser } from "../types";
import { MessageItem } from "./MessageItem";

interface Props {
  users: ChatUser[];
  selectedUserId: number | null;
  onSelectUser: (user: ChatUser) => void;
}

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

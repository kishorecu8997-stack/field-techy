import { FaUserCircle } from "react-icons/fa";
import type { ChatUser } from "../types";

interface Props {
  user: ChatUser;
  active: boolean;
  onClick: () => void;
}
/**
 * The item for the chat message.
 * @param user - The user to display in the item.
 * @param active - Whether the item is active.
 * @param onClick - The function to handle click.
 * @returns The chat message item.
 */
export const MessageItem = ({ user, active, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 border-b border-gray-300 dark:border-gray-700 cursor-pointer
        hover:bg-gray-100 ${active ? "bg-gray-100" : ""}`}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <FaUserCircle className="h-12 w-12 text-gray-500" />
      )}
      <div className="flex-1">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-gray-500">Tap to view messages</p>
      </div>
    </div>
  );
};

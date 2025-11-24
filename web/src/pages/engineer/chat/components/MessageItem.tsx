import { BsCheck2All } from "react-icons/bs"; // Read indicator ✔✔
import { FaUserCircle } from "react-icons/fa";

interface Props {
  user: {
    name: string;
    avatar?: string;
  };
  active: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isRead: boolean;
  onClick: () => void;
}

/**
 * The item for the chat message.
 * @param user - The user to display in the item.
 * @param active - Whether the item is active.
 * @param lastMessage - The last message of the user.
 * @param timestamp - The timestamp of the message.
 * @param unreadCount - The number of unread messages.
 * @param isRead - Whether the message is read.
 * @param onClick - The function to handle click on the item.
 * @returns The chat message item.  
 */
export const MessageItem = ({
  user,
  active,
  lastMessage,
  timestamp,
  unreadCount,
  isRead,
  onClick,
}: Props) => {
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
        <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[60px]">
        <p className="text-xs text-gray-500">{timestamp}</p>
        {unreadCount > 0 ? (
          <div className="bg-green-900 text-white text-sm w-6 h-6 flex items-center justify-center rounded-full">
            {unreadCount}
          </div>
        ) : (
          isRead && <BsCheck2All className="text-green-800 text-xl" />
        )}
      </div>
    </div>
  );
};

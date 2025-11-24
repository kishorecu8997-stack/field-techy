import type { ChatUser } from "../types";

interface Props {
  user: ChatUser;
  active: boolean;
  onClick: () => void;
}

export const MessageItem = ({ user, active, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 border-b cursor-pointer 
        hover:bg-gray-100 ${active ? "bg-gray-100" : ""}`}
    >
      <img
        src={user.avatar}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-gray-500">Tap to view messages</p>
      </div>
    </div>
  );
};

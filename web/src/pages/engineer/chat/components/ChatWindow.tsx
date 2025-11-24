import type { ChatMessage, ChatUser } from "../types";
import { MessageBubble } from "./MessageBubble";

interface Props {
  user: ChatUser | null;
  messages: ChatMessage[];
}

export const ChatWindow = ({ user, messages }: Props) => {
  if (!user)
    return <div className="flex-1 flex items-center justify-center">Select user</div>;

  return (
    <section className="flex flex-col flex-1 bg-white">
      <div className="p-4 border-b">
        <p className="font-semibold">{user.name}</p>
        <p className="text-xs text-gray-500">Status: Online</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <div className="p-4 border-t flex items-center gap-3">
        <input
          type="text"
          placeholder="Write text here..."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button className="h-10 w-10 bg-green-600 text-white rounded-full flex items-center justify-center">
          ▶
        </button>
      </div>
    </section>
  );
};

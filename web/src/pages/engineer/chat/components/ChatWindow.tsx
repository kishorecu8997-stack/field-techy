import { FaVideo } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import type { ChatMessage, ChatUser } from "../types";
import { MessageBubble } from "./MessageBubble";

interface Props {
  user: ChatUser | null;
  messages: ChatMessage[];
}

/**
 * The window for the chat page.
 * @param user - The user to display in the window.
 * @param messages - The list of messages to display in the window.
 * @returns The chat window.
 */
export const ChatWindow = ({ user, messages }: Props) => {
  if (!user)
    return (
      <div className="flex-1 flex items-center justify-center">Select user</div>
    );

  return (
    <section className="flex flex-col flex-1 bg-white">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">Status: Online</p>
        </div>
        <div className="flex items-center gap-6 pr-5">
          <FaVideo className="h-5 w-5 text-gray-500 cursor-pointer hover:text-emerald-600 hover:scale-110" />
          <FaPhone className="h-4 w-4 text-gray-500 cursor-pointer hover:text-emerald-600 hover:scale-110" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <input
          type="text"
          placeholder="Write text here..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
        />
        <div className="h-10 w-10 bg-green-600 text-white rounded-full flex items-center justify-center cursor-pointer">
          <IoMdSend className="text-xl" />
        </div>
      </div>
    </section>
  );
};

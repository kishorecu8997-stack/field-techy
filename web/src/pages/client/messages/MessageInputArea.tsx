// src/components/messages/MessageInputArea.tsx
import React from "react";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { HiOutlinePlus } from "react-icons/hi2";
import { VscSend } from "react-icons/vsc";
import { LuScreenShare } from "react-icons/lu";

interface MessageInputAreaProps {
  newMessage: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
/**
 * MessageInputArea component displays a message input area with buttons for voice, screen sharing, and more.
 *
 * @param {string} newMessage - The new message text.
 * @param {(text: string) => void} onMessageChange - A function to handle message changes.
 * @param {() => void} onSendMessage - A function to handle message sending.
 * @param {(e: React.KeyboardEvent<HTMLInputElement>) => void} onKeyDown - A function to handle keyboard events.
 * @returns {JSX.Element} The MessageInputArea component.
 */
const MessageInputArea: React.FC<MessageInputAreaProps> = ({
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyDown,
}) => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative bg-gray-100 rounded-lg px-3 py-2 flex items-center">
          <div className="p-1 text-gray-500 hover:text-gray-700">
            <MdOutlineKeyboardVoice size={20} />
          </div>

          <input
            type="text"
            placeholder="Write Text here..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 ml-2 bg-transparent outline-none text-gray-800 placeholder-gray-500"
          />

          <div className="flex space-x-1 ml-2">
            <div className="p-2 rounded-full hover:bg-gray-100">
              <HiOutlinePlus size={20} className="text-gray-600" />
            </div>

            <div
              onClick={onSendMessage}
              className="p-2 rounded-full bg-teal-800 text-white hover:bg-teal-900"
            >
              <VscSend size={20} />
            </div>

            <div className="p-2 rounded-full bg-teal-800 text-white hover:bg-teal-900">
              <LuScreenShare size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInputArea;

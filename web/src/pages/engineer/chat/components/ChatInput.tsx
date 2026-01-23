// src/components/ChatWindow/ChatInput.tsx
import { Button } from "@/shared/components/commonUI/Buttons";
import React, { useRef, useState } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";

interface ChatInputProps {
  onSend: (text: string) => void;
  onUploadFile: (file: File) => void;
  onStartVoiceMessage: () => void;
}

/*
 * ChatInput
 *
 * A component that handles the chat input bar.
 * It includes a text input field, a file upload button,
 * a voice message button, and a send button.
 *
 * @param {ChatInputProps} props - The component props.
 * @param {Function} props.onSend - A function to handle sending messages.
 * @param {Function} props.onUploadFile - A function to handle file uploads.
 * @param {Function} props.onStartVoiceMessage - A function to handle starting voice messages.
 * @returns {JSX.Element} The rendered ChatInput component.
 * @constructor
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onUploadFile,
  onStartVoiceMessage,
}) => {
  const [value, setValue] = useState("");
  const [showActions, setShowActions] = useState(false); // 👈 ADDED
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadFile(file);
      event.target.value = "";
    }
  };

  return (
    <div className="relative px-16 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* ⭐ FLOATING ACTIONS (toggle with + button) */}
      <div
        className={`
          absolute right-24 -top-20 flex gap-4 transition-all duration-300
          ${
            showActions
              ? "opacity-100 translate-y-0"
              : "opacity-0 pointer-events-none translate-y-4"
          }
        `}
      >
        <div className="h-16 w-16 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center">
          <Button
            className="h-11 w-11 rounded-full bg-emerald-800 text-white flex items-center justify-center text-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            📄
          </Button>
        </div>

        <div className="h-16 w-16 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center">
          <Button
            className="h-11 w-11 rounded-full bg-emerald-800 text-white flex items-center justify-center text-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            🖼️
          </Button>
        </div>
      </div>

      {/* INPUT BAR */}
      <div className="flex items-center gap-4">
        {/* voice icon */}
        <div
          onClick={onStartVoiceMessage}
          className="p-2 rounded-full text-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <FaMicrophoneAlt />
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write Text here..."
            className="w-full rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm outline-none dark:text-gray-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        {/* ⭐ PLUS Button (toggles floating menu) */}
        <div
          className="h-11 w-11 rounded-full bg-emerald-800 text-white flex items-center cursor-pointer justify-center text-2xl"
          onClick={() => setShowActions((prev) => !prev)}
        >
          {showActions ? "×" : "+"}
        </div>
        {/* send */}
        <div
          className="h-11 w-11 rounded-full bg-emerald-800 text-white flex items-center justify-center cursor-pointer text-xl"
          onClick={handleSend}
        >
          ➤
        </div>

        {/* hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

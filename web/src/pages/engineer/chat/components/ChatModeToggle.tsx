// src/components/ChatModeToggle.tsx
import React from "react";
import type { ChatMode } from "../types";

interface ChatModeToggleProps {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
}

/*
 * ChatModeToggle
 *
 * A component that displays a toggle for selecting between personal and group chat modes.
 *
 * @param {ChatMode} mode - The current chat mode.
 * @param {(mode: ChatMode) => void} onChange - A callback function to handle mode changes.
 * @returns {JSX.Element} The rendered chat mode toggle component.
 * @constructor
 */
export const ChatModeToggle: React.FC<ChatModeToggleProps> = ({
  mode,
  onChange,
}) => {
  return (
    <div className="inline-flex rounded-full border bg-white overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div
        className={`px-4 py-2 text-sm cursor-pointer ${
          mode === "personal"
            ? "bg-teal-800 text-white dark:bg-teal-600 dark:text-white font-medium"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium"
        }`}
        onClick={() => onChange("personal")}
      >
        Personal Chat
      </div>
      <div
        className={`px-4 py-2 text-sm cursor-pointer ${
          mode === "group"
            ? "bg-teal-800 text-white dark:bg-teal-600 dark:text-white font-medium"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium"
        }`}
        onClick={() => onChange("group")}
      >
        Group Chat
      </div>
    </div>
  );
};

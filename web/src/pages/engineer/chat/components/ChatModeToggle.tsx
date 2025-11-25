// src/components/ChatModeToggle.tsx
import React from "react";
import type { ChatMode } from "../types";

interface ChatModeToggleProps {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
}

export const ChatModeToggle: React.FC<ChatModeToggleProps> = ({
  mode,
  onChange,
}) => {
  return (
    <div className="inline-flex rounded-full border bg-white overflow-hidden">
      <button
        type="button"
        className={`px-4 py-2 text-sm ${
          mode === "personal"
            ? "bg-emerald-800 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => onChange("personal")}
      >
        Personal Chat
      </button>
      <button
        type="button"
        className={`px-4 py-2 text-sm ${
          mode === "group"
            ? "bg-emerald-800 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => onChange("group")}
      >
        Group Chat
      </button>
    </div>
  );
};

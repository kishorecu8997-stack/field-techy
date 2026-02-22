// ShareScreenWindow.tsx
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  MdPerson,
  MdCallEnd,
  MdVideocamOff,
  MdMicOff,
  MdScreenShare,
} from "react-icons/md";
import { assetsConfig } from "@/assets";

interface ShareScreenWindowProps {
  isVisible: boolean;
  callerName?: string;
  onClose: () => void;         // top-right X
  onStopSharing: () => void;   // "Stop Sharing" button (and optionally screen-share toggle)
  onEndCall: () => void;       // red end call button
}

const ShareScreenWindow: React.FC<ShareScreenWindowProps> = ({
  isVisible,
  callerName = "Helen",
  onClose,
  onStopSharing,
  onEndCall,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    setSecondsElapsed(0);
    const t = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isVisible]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {/* Left: FT logo */}
        <div className="flex items-center">
          <img
            src={assetsConfig.logos.companyLogo}
            alt="logo"
            className="h-10 w-10"
          />
        </div>

        {/* Center: name + duration */}
        <div className="text-center leading-tight">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {callerName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDuration(secondsElapsed)}
          </div>
        </div>

        {/* Right: close */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Main share preview area */}
      <div className="relative h-[calc(100vh-64px-88px)] bg-black">
        {/* Fake dark preview (match screenshot – no real stream yet) */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Center overlay text + button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white/90 text-sm mb-4">
            You&apos;re sharing your screen
          </div>
          <button
            onClick={onStopSharing}
            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow"
          >
            Stop Sharing
          </button>
        </div>

        {/* Bottom-right mini participant card */}
        <div className="absolute right-8 bottom-8 w-[270px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center">
              <MdPerson size={34} className="text-white" />
            </div>
          </div>

          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-3 py-1 text-xs text-gray-800 dark:text-gray-100">
              {callerName}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Video off"
                className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                <MdVideocamOff size={18} />
              </button>
              <button
                type="button"
                aria-label="Mic off"
                className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                <MdMicOff size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="h-[88px] px-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Left controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Video off"
            className="w-20 h-14 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            <MdVideocamOff size={22} />
          </button>

          <button
            type="button"
            aria-label="Mic off"
            className="w-20 h-14 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            <MdMicOff size={22} />
          </button>

          <button
            type="button"
            aria-label="Screen share"
            className="w-20 h-14 rounded-full bg-teal-700 dark:bg-teal-700 flex items-center justify-center text-white"
          >
            <MdScreenShare size={22} />
          </button>
        </div>

        {/* Right: end call */}
        <button
          type="button"
          aria-label="End Call"
          onClick={onEndCall}
          className="w-20 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow"
        >
          <MdCallEnd size={22} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ShareScreenWindow;
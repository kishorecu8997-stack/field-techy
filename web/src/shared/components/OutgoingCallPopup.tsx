import React, { useRef } from "react";
import Draggable from "react-draggable";
import { FaPhoneSlash, FaTimes, FaUser, FaVideoSlash, FaMicrophoneSlash } from "react-icons/fa";
import { assetsConfig } from "@/assets";

interface OutgoingCallPopupProps {
  contactName?: string;
  onClose: () => void;
}

const OutgoingCallPopup: React.FC<OutgoingCallPopupProps> = ({ contactName, onClose }) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Subtle blur-only backdrop */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      <Draggable nodeRef={nodeRef} handle=".drag-handle">
        {/* Modal */}
        <div ref={nodeRef} className="relative z-10 w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Top section: logo + close */}
          <div className="drag-handle cursor-move flex items-center justify-between px-4 py-3">
            {/* drag handle */}
          <div className="flex items-center gap-2">
            <img src={assetsConfig.logos.ftLogo} alt="Field Techy" className="h-6 w-auto" />
          </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 p-1 rounded cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

        {/* Center section */}
        <div className="px-6 pt-2 pb-4 text-center">
          <div className="mx-auto w-28 h-28 rounded-full bg-teal-600 flex items-center justify-center shadow-md">
            <FaUser size={48} className="text-white" />
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{contactName || "Unknown"}</div>
            <div className="text-sm text-gray-500 mt-1">Ringing...</div>
          </div>
        </div>

        {/* Bottom control bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle Video"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-sm"
            >
              <FaVideoSlash />
            </button>
            <button
              aria-label="Toggle Mute"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-sm"
            >
              <FaMicrophoneSlash />
            </button>
          </div>

          <div className="flex items-center">
            <button
              aria-label="End Call"
              onClick={onClose}
              className="ml-2 bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
            >
              <FaPhoneSlash />
            </button>
          </div>
        </div>
        </div>
      </Draggable>

    </div>
  );
};

export default OutgoingCallPopup;
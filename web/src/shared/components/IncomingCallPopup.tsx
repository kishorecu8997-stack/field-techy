import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaUser } from "react-icons/fa";
import OngoingCall from "./OngoingCall";

interface IncomingCallPopupProps {
  isVisible?: boolean;
  callerName?: string;
  callType?: string; // e.g., "Voice Call"
  onAccept: () => void;
  onReject: () => void;
  onClose?: () => void;
}

const IncomingCallPopup: React.FC<IncomingCallPopupProps> = ({
  isVisible = true,
  callerName = "Kraft And Co (Client)",
  callType = "Voice Call",
  onAccept,
  onReject,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [showOngoingCall, setShowOngoingCall] = useState(false);

  if (!isVisible && !showOngoingCall) return null;

  const handleAccept = () => {
    setShowOngoingCall(true);
    onAccept();
  };

  const handleEndCall = () => {
    setShowOngoingCall(false);
  };

  const handleCloseOngoingCall = () => {
    setShowOngoingCall(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Subtle blur-only backdrop */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
        {!showOngoingCall && (
      <Draggable nodeRef={nodeRef} handle=".drag-handle">
        <div
          ref={nodeRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Incoming call from ${callerName}`}
          className="relative z-10 w-full max-w-md mx-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Drag handle / header (invisible but available for dragging) */}
          <div className="drag-handle cursor-move px-6 py-4 flex justify-center">
            {/* intentionally empty: user drags by the top area */}
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-2 text-center">
            {/* Avatar */}
            <div className="mx-auto w-30 h-30 rounded-full bg-teal-600 flex items-center justify-center shadow-md" style={{ width: 120, height: 120 }}>
              <FaUser size={56} className="text-white" />
            </div>

            {/* Caller Info */}
            <div className="mt-6">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{callerName}</div>
              <div className="text-sm text-gray-500 mt-1">{callType}</div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                aria-label="Reject call"
                onClick={onReject}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-2"
              >
                
                <span>Reject</span>
              </button>

              <button
                aria-label="Accept call"
                onClick={handleAccept}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-2"
              >
                
                <span>Accept</span>
              </button>
            </div>

            
          </div>
        </div>
      </Draggable>
        )}

      {/* Ongoing Call Popup - shown when call is accepted */}
      <OngoingCall
        isVisible={showOngoingCall}
        callerName="Helen"
        onClose={handleCloseOngoingCall}
        onEndCall={handleEndCall}
      />
    </div>
  );
};

export default IncomingCallPopup;
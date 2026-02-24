import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaUser } from "react-icons/fa";
import OngoingCall from "./OngoingCall";
import { Button } from "./commonUI/Buttons";

/**
 * IncomingCallPopup Component
 *
 * Displays a draggable popup for incoming voice/video calls with caller info,
 * avatar, and action buttons to accept or reject the call. Once accepted,
 * it transitions to an ongoing call view using the OngoingCall component.
 *
 * Props:
 * - isVisible: Controls visibility of the incoming call popup.
 * - callerName: Name of the caller to display.
 * - callType: Type of call (e.g., "Voice Call", "Video Call").
 * - onAccept: Callback when the call is accepted.
 * - onReject: Callback when the call is rejected.
 * - onClose: Optional callback when the popup is closed.
 */
interface IncomingCallPopupProps {
  isVisible?: boolean;
  callerName?: string;
  callType?: string;
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
    <div className="fixed top-20 right-20 z-50">
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
              <div
                className="mx-auto w-30 h-30 rounded-full bg-teal-600 flex items-center justify-center shadow-md"
                style={{ width: 120, height: 120 }}
              >
                <FaUser size={56} className="text-white" />
              </div>

              {/* Caller Info */}
              <div className="mt-6">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {callerName}
                </div>
                <div className="text-sm text-gray-500 mt-1">{callType}</div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-center gap-6">
                <Button
                  aria-label="Reject call"
                  onClick={onReject}
                  variant="rejectCall"
                >
                  <span>Reject</span>
                </Button>

                <Button
                  aria-label="Accept call"
                  onClick={handleAccept}
                  variant="acceptCall"
                >
                  <span>Accept</span>
                </Button>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {/* Ongoing Call Popup - shown when call is accepted */}
      <OngoingCall
        isVisible={showOngoingCall}
        callerName={callerName}
        onClose={handleCloseOngoingCall}
        onEndCall={handleEndCall}
      />
    </div>
  );
};

export default IncomingCallPopup;

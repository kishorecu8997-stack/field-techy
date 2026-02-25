import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  FaTimes,
  FaUser,
  FaVideoSlash,
  FaMicrophoneSlash,
  FaVideo,
  FaMicrophone,
} from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { assetsConfig } from "@/assets";
import { Button } from "./commonUI/Buttons";
/**
 * OutgoingCallPopup
 *
 * A draggable modal that shows an outgoing call interface
 * with caller info, video/mic controls, and an end call button.
 *
 * @param props - Component props
 * @returns Outgoing call popup modal
 */
interface OutgoingCallPopupProps {
  contactName?: string;
  onClose: () => void;
}

const OutgoingCallPopup: React.FC<OutgoingCallPopupProps> = ({
  contactName,
  onClose,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  // Toggle states for video and mic buttons
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Subtle blur-only backdrop */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      <Draggable nodeRef={nodeRef} handle=".drag-handle">
        {/* Modal */}
        <div
          ref={nodeRef}
          className="relative z-10 w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Top section: logo + close */}
          <div className="drag-handle cursor-move flex items-center justify-between px-4 py-3">
            {/* drag handle */}
            <div className="flex items-center gap-2">
              <img
                src={assetsConfig.logos.ftLogo}
                alt="Field Techy"
                className="h-6 w-auto block dark:hidden"
              />
              <img
                src={assetsConfig.logos.ftLogoWhite}
                alt="Field Techy"
                className="h-6 w-auto hidden dark:block"
              />
            </div>
            <Button aria-label="Close" onClick={onClose} variant="close">
              <FaTimes />
            </Button>
          </div>

          {/* Center section */}
          <div className="px-6 pt-2 pb-4 text-center">
            <div className="mx-auto w-28 h-28 rounded-full bg-teal-600 flex items-center justify-center shadow-md">
              <FaUser size={48} className="text-white" />
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {contactName || "Unknown"}
              </div>
              <div className="text-sm text-gray-500 mt-1">Ringing...</div>
            </div>
          </div>

          {/* Bottom control bar */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                aria-label={isVideoOn ? "Turn video off" : "Turn video on"} 
                variant="callControl"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <FaVideo size={25} /> : <FaVideoSlash size={25} />}
              </Button>
              <Button 
                aria-label={isMicOn ? "Turn mic off" : "Turn mic on"} 
                variant="callControl"
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <FaMicrophone size={25} /> : <FaMicrophoneSlash size={25} />}
              </Button>
            </div>

            <div className="flex items-center">
              <Button aria-label="End Call" variant="endCall" onClick={onClose}>
                <MdCallEnd size={25} />
              </Button>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default OutgoingCallPopup;

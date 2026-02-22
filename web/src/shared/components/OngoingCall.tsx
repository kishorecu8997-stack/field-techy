import React, { useRef, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { FiX } from "react-icons/fi";
import {
  MdPerson,
  MdCallEnd,
  MdScreenShare,
  MdVideocam,
  MdVideocamOff,
  MdMic,
  MdMicOff,
  MdStopScreenShare,
} from "react-icons/md";
import SwitchToVideoCallModal from "./SwitchToVideoCallModal";
import ShareScreen from "./ShareScreen";
import { assetsConfig } from "@/assets";
import ShareScreenWindow from "./ShareScreenWindow";
import VideoCall from "./VideoCall";

interface OngoingCallProps {
  isVisible?: boolean;
  callerName?: string;
  onClose?: () => void;
  onEndCall?: () => void;
}

const OngoingCall: React.FC<OngoingCallProps> = ({
  isVisible = true,
  callerName = "Helen",
  onClose,
  onEndCall,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // toggles
  const [isVideoOn, setIsVideoOn] = useState(false); // slashed initially
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = useState(true);

  // modals/screens
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showShareScreen, setShowShareScreen] = useState(false);
  const [showShareScreenWindow, setShowShareScreenWindow] = useState(false);

  // ✅ MISSING STATE (this is the main error)
  const [showVideoCall, setShowVideoCall] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    setSecondsElapsed(0);
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const formatDuration = (sec: number) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-opacity-30" />

      <Draggable nodeRef={nodeRef} handle=".drag-handle">
        <div
          ref={nodeRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Ongoing call with ${callerName}`}
          className="relative z-10 w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="drag-handle cursor-move flex items-center justify-between px-6 py-4">
            <div className="flex justify-center mb-8">
              <img
                src={assetsConfig.logos.companyLogo}
                alt="logo"
                className="h-10 w-10 sm:h-10 sm:w-10"
              />
            </div>

            <button
              aria-label="Close"
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded cursor-pointer transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Center */}
          <div className="px-8 pb-8 pt-4 text-center">
            <div
              className="mx-auto rounded-full flex items-center justify-center shadow-md"
              style={{ width: 120, height: 120, backgroundColor: "#0d9488" }}
            >
              <MdPerson size={56} className="text-white" />
            </div>

            <div className="mt-6">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {callerName}
              </div>
            </div>

            <div className="mt-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDuration(secondsElapsed)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              {/* ✅ Video: slashed initially, NOT faded */}
              <button
                aria-label={isVideoOn ? "Video On" : "Video Off"}
                onClick={() => {
                  setIsVideoOn(true);
                  setShowVideoCall(true);
                }}
                className={`w-20 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                  isVideoOn
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                {isVideoOn ? (
                  <MdVideocam
                    className="text-gray-700 dark:text-gray-200"
                    size={25}
                  />
                ) : (
                  <MdVideocamOff
                    className="text-gray-700 dark:text-gray-200"
                    size={25}
                  />
                )}
              </button>

              <button
                aria-label={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-20 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                  isMicOn
                    ? "hover:opacity-90"
                    : "bg-gray-200 dark:bg-gray-600 opacity-60 hover:opacity-80"
                }`}
                style={isMicOn ? { backgroundColor: "#0d9488" } : {}}
              >
                {isMicOn ? (
                  <MdMic size={25} className="text-white" />
                ) : (
                  <MdMicOff
                    size={25}
                    className="text-gray-400 dark:text-gray-500"
                  />
                )}
              </button>

              <button
                aria-label={
                  isScreenShareOn ? "Stop Screen Share" : "Start Screen Share"
                }
                onClick={() => setShowSwitchModal(true)}
                className={`w-20 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                  isScreenShareOn
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-gray-200 dark:bg-gray-600 opacity-60 hover:opacity-80"
                }`}
              >
                {isScreenShareOn ? (
                  <MdScreenShare
                    className="text-gray-600 dark:text-gray-300"
                    size={25}
                  />
                ) : (
                  <MdStopScreenShare
                    className="text-gray-400 dark:text-gray-500"
                    size={25}
                  />
                )}
              </button>
            </div>

            {/* ✅ safer onClick */}
            <button
              aria-label="End Call"
              onClick={() => (onEndCall ? onEndCall() : onClose?.())}
              className="w-20 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
              style={{ backgroundColor: "#dc2626" }}
            >
              <MdCallEnd size={24} className="text-white" />
            </button>
          </div>
        </div>
      </Draggable>

      {/* Switch to Video Call Modal */}
      <SwitchToVideoCallModal
        isVisible={showSwitchModal}
        onCancel={() => setShowSwitchModal(false)}
        onConfirm={() => {
          setShowSwitchModal(false);
          setShowShareScreen(true);
        }}
      />

      {/* Share Screen Modal */}
      <ShareScreen
        isVisible={showShareScreen}
        onCancel={() => setShowShareScreen(false)}
        onShare={() => {
          setIsScreenShareOn(true);
          setShowShareScreen(false);
          setShowShareScreenWindow(true);
        }}
      />

      <ShareScreenWindow
        isVisible={showShareScreenWindow}
        callerName={callerName}
        onClose={() => setShowShareScreenWindow(false)}
        onStopSharing={() => {
          setIsScreenShareOn(false);
          setShowShareScreenWindow(false);
        }}
        onEndCall={() => {
          setIsScreenShareOn(false);
          setShowShareScreenWindow(false);
          (onEndCall || onClose)?.();
        }}
      />

      <VideoCall
        isVisible={showVideoCall}
        callerName={callerName}
        onClose={() => {
          setShowVideoCall(false);
          setIsVideoOn(false); // optional: go back to slashed when closed
        }}
        onEndCall={() => {
          setShowVideoCall(false);
          setIsVideoOn(false);
          (onEndCall || onClose)?.();
        }}
      />
    </div>
  );
};

export default OngoingCall;
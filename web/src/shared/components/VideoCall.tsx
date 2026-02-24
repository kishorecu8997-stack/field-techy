import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdPerson,
  MdScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { assetsConfig } from "@/assets";
import ShareScreen from "./ShareScreen";
import ShareScreenWindow from "./ShareScreenWindow";

interface VideoCallProps {
  isVisible: boolean;
  callerName?: string;
  onClose: () => void;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  isVisible,
  callerName = "Helen",
  onClose,
  onEndCall,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Common pattern states
  const [isCamOn, setIsCamOn] = useState(false); // initially slashed
  const [isMicOn, setIsMicOn] = useState(true);

  // Screen share states
  const [showShareScreen, setShowShareScreen] = useState(false);
  const [showShareScreenWindow, setShowShareScreenWindow] = useState(false);

  // Camera permission / stream state
  const [camError, setCamError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const stopLocalStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const startLocalStream = async () => {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        // iOS/Safari needs play() sometimes
        await localVideoRef.current.play().catch(() => {});
      }
      setIsCamOn(true);
    } catch {
      setIsCamOn(false);
      stopLocalStream();
      setCamError("Camera permission denied or camera not available.");
    }
  };

  // timer
  useEffect(() => {
    if (!isVisible) return;
    setSecondsElapsed(0);
    const t = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isVisible]);

  // when popup opens -> ask camera permission (show local preview if granted)
  useEffect(() => {
    if (!isVisible) return;

    // ask permission on open (as you requested)
    startLocalStream();

    return () => {
      stopLocalStream();
      setCamError(null);
      setIsCamOn(false); // reset to slashed when closed
      setIsMicOn(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {/* Left: FT logo */}
        <div className="flex items-center">
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
          onClick={() => {
            stopLocalStream();
            onClose();
          }}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Main video area */}
      <div className="relative h-[calc(100vh-64px-88px)] bg-black">
        {/* Remote video placeholder (until APIs/WebRTC exist) */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <MdPerson size={36} className="text-white/80" />
              </div>
              <div className="mt-3 text-white/90 text-sm font-medium">
                {callerName}
              </div>
              <div className="mt-1 text-white/60 text-xs">
                Waiting for video…
              </div>
            </div>
          </div>
        </div>

        {/* Local preview (bottom-right) */}
        <div className="absolute right-8 bottom-8 w-[260px] h-[160px] rounded-lg overflow-hidden border border-white/20 shadow-lg bg-black">
          {isCamOn && !camError ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/70">
              <div className="text-center px-3">
                <div className="text-white/80 text-xs font-medium">You</div>
                <div className="mt-2 text-white/60 text-[11px]">
                  {camError ? camError : "Camera is off"}
                </div>
              </div>
            </div>
          )}

          {/* "You" label */}
          <div className="absolute left-2 bottom-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded">
            You
          </div>
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="h-[88px] px-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Left controls */}
        <div className="flex items-center gap-4">
          {/* Camera toggle (slashed initially, NOT faded) */}
          <button
            type="button"
            aria-label={isCamOn ? "Turn camera off" : "Turn camera on"}
            onClick={async () => {
              if (isCamOn) {
                setIsCamOn(false);
                stopLocalStream();
              } else {
                await startLocalStream();
              }
            }}
            className="w-20 h-14 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            {isCamOn ? (
              <MdVideocam
                size={22}
                className="text-teal-800 dark:text-teal-300"
              />
            ) : (
              <MdVideocamOff
                size={22}
                className="text-gray-700 dark:text-gray-200"
              />
            )}
          </button>

          {/* Mic toggle (common pattern) */}
          <button
            type="button"
            aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
            onClick={() => setIsMicOn((p) => !p)}
            className="w-20 h-14 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            {isMicOn ? (
              <MdMic size={22} className="text-teal-800 dark:text-teal-300" />
            ) : (
              <MdMicOff
                size={22}
                className="text-gray-700 dark:text-gray-200"
              />
            )}
          </button>

          <button
            type="button"
            aria-label="Screen share"
            onClick={() => setShowShareScreen(true)}
            className="w-20 h-14 rounded-full bg-teal-700 dark:bg-teal-700 flex items-center justify-center text-white"
          >
            <MdScreenShare size={22} className="text-white" />
          </button>
        </div>

        {/* End call */}
        <button
          type="button"
          aria-label="End Call"
          onClick={() => {
            stopLocalStream();
            onEndCall();
          }}
          className="w-20 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow"
        >
          <MdCallEnd size={22} className="text-white" />
        </button>
      </div>

      {/* Share Screen Modal */}
      <ShareScreen
        isVisible={showShareScreen}
        onCancel={() => setShowShareScreen(false)}
        onShare={() => {
          setShowShareScreen(false);
          setShowShareScreenWindow(true);
        }}
      />

      {/* Share Screen Window */}
      <ShareScreenWindow
        isVisible={showShareScreenWindow}
        callerName={callerName}
        onClose={() => setShowShareScreenWindow(false)}
        onStopSharing={() => setShowShareScreenWindow(false)}
        onEndCall={() => {
          setShowShareScreenWindow(false);
          onEndCall();
        }}
      />
    </div>
  );
};

export default VideoCall;

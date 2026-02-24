import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdPerson,
  MdVideocam,
  MdVideocamOff,
  MdScreenShare,
  MdStopScreenShare,
} from "react-icons/md";
import { assetsConfig } from "@/assets";

export type GroupCallParticipant = {
  id: string;
  name: string;
  isYou?: boolean;
  micOn: boolean;
  videoOn: boolean;
  // Future (API/WebRTC): attach remote MediaStream here
  stream?: MediaStream;
};

interface VideoCallGroupProps {
  isVisible: boolean;
  title?: string; // e.g., JOB-001
  participants?: GroupCallParticipant[]; // if not provided -> uses internal mock
  onClose: () => void;
  onEndCall: () => void;
}

const VideoCallGroup: React.FC<VideoCallGroupProps> = ({
  isVisible,
  title = "JOB-001",
  participants,
  onClose,
  onEndCall,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // local toggles
  const [isCamOn, setIsCamOn] = useState(false); // slashed initially
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);

  // choose who is featured on the big tile
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const mockParticipants = useMemo<GroupCallParticipant[]>(
    () => [
      { id: "you", name: "You", isYou: true, micOn: true, videoOn: true },
      { id: "helen", name: "Helen", micOn: true, videoOn: true },
      { id: "john", name: "John", micOn: false, videoOn: false },
      { id: "kraft", name: "Kraft And Co", micOn: true, videoOn: false },
    ],
    [],
  );

  const roster =
    participants && participants.length ? participants : mockParticipants;

  const me = roster.find((p) => p.isYou) || roster[0];
  const others = roster.filter((p) => !p.isYou);

  const featured = useMemo(() => {
    if (pinnedId) return roster.find((p) => p.id === pinnedId) || me;
    // default: show "You" as the big tile like screenshot
    return me;
  }, [pinnedId, roster, me]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }
      setIsCamOn(true);
    } catch {
      setIsCamOn(false);
      stopLocalStream();
    }
  };

  // timer
  useEffect(() => {
    if (!isVisible) return;
    setSecondsElapsed(0);
    const t = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isVisible]);

  // ask camera permission on open
  useEffect(() => {
    if (!isVisible) return;

    startLocalStream();

    return () => {
      stopLocalStream();
      setIsCamOn(false);
      setIsMicOn(true);
      setIsScreenShareOn(false);
      setPinnedId(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!isVisible) return null;

  const Tile = ({
    p,
    variant = "small",
  }: {
    p: GroupCallParticipant;
    variant?: "small" | "featured";
  }) => {
    const isFeatured = variant === "featured";
    const showLocal = p.isYou && isCamOn;

    return (
      // IMPORTANT: w-full h-full so tile ALWAYS uses full given height
      <div
        className={`relative w-full h-full overflow-hidden rounded-xl border ${
          isFeatured
            ? "border-gray-300 dark:border-gray-700"
            : "border-gray-200 dark:border-gray-700"
        } bg-black`}
      >
        {/* Video area / placeholder */}
        {showLocal ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <MdPerson size={28} className="text-white" />
            </div>
          </div>
        )}

        {/* Name pill */}
        <div className="absolute left-2 bottom-2 bg-white/90 text-gray-900 text-xs px-2 py-0.5 rounded">
          {p.name}
        </div>

        {/* right-bottom icons */}
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-700">
            {p.videoOn ? <MdVideocam size={16} /> : <MdVideocamOff size={16} />}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-700">
            {p.micOn ? <MdMic size={16} /> : <MdMicOff size={16} />}
          </div>
        </div>

        {/* clickable overlay for pinning (small tiles only) */}
        {!isFeatured && (
          <button
            type="button"
            aria-label={`Pin ${p.name}`}
            onClick={() => setPinnedId(p.id)}
            className="absolute inset-0"
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[80] bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {/* Left logo */}
        <img
          src={assetsConfig.logos.companyLogo}
          alt="logo"
          className="h-10 w-10"
        />

        {/* Title + time */}
        <div className="text-center leading-tight">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDuration(secondsElapsed)}
          </div>
        </div>

        {/* Close */}
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

      {/* Body (full height between header and bottom controls) */}
      <div className="h-[calc(100vh-64px-88px)] px-6 py-4">
        {/* IMPORTANT: min-h-0 allows children to stretch correctly in grid */}
        <div className="h-full min-h-0 grid grid-cols-[1fr_360px] gap-6">
          {/* Left: featured tile */}
          {/* IMPORTANT: min-h-0 so tile can take full height */}
          <div className="h-full min-h-0">
            <div className="h-full min-h-0 rounded-xl overflow-hidden">
              <Tile p={featured} variant="featured" />
            </div>
          </div>

          {/* Right: participants column */}
          {/* IMPORTANT: min-h-0 so the list can scroll without shrinking left */}
          <div className="h-full min-h-0">
            <div className="h-full min-h-0 overflow-y-auto pr-2 space-y-4">
              {/* top preview tile */}
              <div className="h-[190px]">
                <Tile
                  p={
                    others[0] || {
                      id: "helen",
                      name: "Helen",
                      micOn: true,
                      videoOn: true,
                    }
                  }
                />
              </div>

              {others.slice(1).map((p) => (
                <div key={p.id} className="h-[190px]">
                  <Tile p={p} />
                </div>
              ))}

              {/* placeholders */}
              {others.length === 0 && (
                <>
                  <div className="h-[190px]">
                    <Tile
                      p={{
                        id: "p1",
                        name: "John",
                        micOn: false,
                        videoOn: false,
                      }}
                    />
                  </div>
                  <div className="h-[190px]">
                    <Tile
                      p={{
                        id: "p2",
                        name: "Kraft And Co",
                        micOn: true,
                        videoOn: false,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="h-[88px] px-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          {/* Cam */}
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

          {/* Mic */}
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

          {/* Screen share (UI only) */}
          <button
            type="button"
            aria-label={
              isScreenShareOn ? "Stop screen share" : "Start screen share"
            }
            onClick={() => setIsScreenShareOn((p) => !p)}
            className={`w-20 h-14 rounded-full flex items-center justify-center ${
              isScreenShareOn
                ? "bg-teal-700 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            {isScreenShareOn ? (
              <MdStopScreenShare size={22} />
            ) : (
              <MdScreenShare size={22} />
            )}
          </button>
        </div>

        {/* End */}
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
    </div>
  );
};

export default VideoCallGroup;

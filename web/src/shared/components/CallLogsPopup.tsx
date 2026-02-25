import React, { useRef } from "react";
import { IoMdCall } from "react-icons/io";
import { FaUser, FaUsers, FaVideo } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Draggable from "react-draggable";
import { Button } from "./commonUI/Buttons";
import { defaultMockCallLogs } from "@/dummy_data/callLogs";
import type { CallLog } from "@/dummy_data/callLogs";

interface CallLogsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  callLogs?: CallLog[];
}

const CallLogsPopup: React.FC<CallLogsPopupProps> = ({
  isOpen,
  onClose,
  callLogs = defaultMockCallLogs,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const getCallTypeColor = (callType: CallLog["callType"]) => {
    switch (callType) {
      case "incoming":
        return "text-green-600";
      case "missed":
        return "text-red-600";
      case "outgoing":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getCallTypeLabel = (callType: CallLog["callType"]) => {
    switch (callType) {
      case "incoming":
        return "Incoming call";
      case "missed":
        return "Missed call";
      case "outgoing":
        return "Outgoing call";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Draggable Modal */}
      <Draggable
        nodeRef={nodeRef}
        handle=".modal-header"
        // Optional: prevent dragging when interacting with these
        cancel="button, a, input, textarea, select"
      >
        <div
          ref={nodeRef}
          className="relative bg-gray-100 rounded-lg shadow-xl w-full max-w-sm h-[550px] mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200 cursor-move">
            <h2 className="text-lg font-bold text-gray-800">Call Logs</h2>
            <Button onClick={onClose} variant="close" aria-label="Close">
              <FiX size={20} />
            </Button>
          </div>

          {/* Call Log Entries */}
          <div className="max-h-[500px] overflow-y-auto pb-8">
            {callLogs.map((log, index) => (
              <div key={log.id}>
                <div className="flex items-center p-4 hover:bg-gray-200 transition-colors">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.isGroup ? "bg-indigo-700" : "bg-purple-600"
                    }`}
                  >
                    {log.isGroup ? (
                      <FaUsers className="text-white" size={20} />
                    ) : (
                      <FaUser className="text-white" size={20} />
                    )}
                  </div>

                  {/* Call Details */}
                  <div className="ml-3 flex-1 min-w-0">
                    <div
                      className={`font-semibold text-sm truncate ${
                        log.callType === "missed"
                          ? "text-red-600"
                          : "text-black"
                      }`}
                    >
                      {log.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      <span>{log.time}, </span>
                      <span className={getCallTypeColor(log.callType)}>
                        {getCallTypeLabel(log.callType)}
                      </span>
                      {log.duration && <span>, {log.duration}</span>}
                    </div>
                  </div>

                  {/* Action Icon */}
                  <div className="ml-2 flex-shrink-0">
                    {log.callIcon === "video" ? (
                      <FaVideo className="text-gray-500" size={18} />
                    ) : (
                      <IoMdCall className="text-gray-500" size={18} />
                    )}
                  </div>
                </div>

                {index < callLogs.length - 1 && (
                  <div className="border-t border-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default CallLogsPopup;

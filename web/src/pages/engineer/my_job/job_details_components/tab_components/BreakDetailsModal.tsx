import React from "react";
import { HiXMark } from "react-icons/hi2";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import type { ProgressUpdate } from "../../types.d";
import { formatDateToMMDDYYYY } from "@/utils/formatDateTime";
import { ENGINEER_MODAL_TITLES, LABELS } from "@/constants/timelineConstants";
import { MODAL_MESSAGES } from "@/dummy_data/engineerTimelineDummyData";

interface BreakDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBreak: ProgressUpdate | null;
}

/**
 * BreakDetailsModal - Modal popup for viewing break request details
 * Displays break dates, duration, reason, and application timestamp
 */
const BreakDetailsModal: React.FC<BreakDetailsModalProps> = ({
  isOpen,
  onClose,
  activeBreak,
}) => {
  return (
    <Popup open={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {ENGINEER_MODAL_TITLES.breakRequestApproved}
          </h3>
          <Button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <HiXMark className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-5 pb-4">
          <div className="border rounded-lg p-4 bg-white">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              {activeBreak?.title || LABELS.breakTitleFallback}
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 text-white text-xs font-semibold mb-2">
              {activeBreak?.requestType === "Long Term Break" ||
              activeBreak?.startDate ||
              activeBreak?.endDate
                ? `${formatDateToMMDDYYYY(activeBreak?.startDate)} to ${formatDateToMMDDYYYY(
                    activeBreak?.endDate,
                  )}`
                : `${activeBreak?.startTime || "-"} to ${activeBreak?.endTime || "-"}`}
              {activeBreak?.duration ? ` - ${activeBreak.duration}` : ""}
            </div>
            {activeBreak?.reason && (
              <p className="text-sm text-gray-800 mb-1">{activeBreak.reason}</p>
            )}
            {activeBreak?.timestamp && (
              <p className="text-xs text-gray-500">
                Applied on: {activeBreak.timestamp}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-800 mt-4">
            {MODAL_MESSAGES.breakReminder}
          </p>
        </div>
      </div>
    </Popup>
  );
};

export default BreakDetailsModal;

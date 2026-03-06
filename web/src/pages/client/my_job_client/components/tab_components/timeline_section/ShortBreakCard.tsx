import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { TimelineCardData } from "@/pages/client/my_job_client/types";
import { TIMELINE_STATUS } from "@/constants/timelineConstants";
import type { TimelineStatus } from "@/constants/timelineConstants";

interface ShortBreakCardProps {
  isCollapsed: boolean;
  cardData: TimelineCardData;
  shortBreakAccentColor: string;
  shortBreakStatus: TimelineStatus;
  shortBreakStatusNode: React.ReactNode;
  onShortBreakReject: () => void;
  onShortBreakApprove: () => void;
}

/**
 * ShortBreakCard - Renders short break request card with status and actions
 */
const ShortBreakCard: React.FC<ShortBreakCardProps> = ({
  isCollapsed,
  cardData,
  shortBreakAccentColor,
  shortBreakStatus,
  shortBreakStatusNode,
  onShortBreakReject,
  onShortBreakApprove,
}) => {
  if (isCollapsed) {
    return (
      <div
        className="relative rounded-lg border bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm flex items-center justify-between"
        style={{ borderColor: shortBreakAccentColor }}
      >
        <span
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: shortBreakAccentColor }}
          aria-hidden
        />
        <div className="flex items-center gap-3 pl-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {cardData.title}
          </span>
          {/* Show break time/date in collapsed view */}
          {cardData.startDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({cardData.startDate})
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {cardData.timestamp}
          </span>
          {shortBreakStatusNode}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm"
      style={{ borderColor: shortBreakAccentColor }}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: shortBreakAccentColor }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4 pl-2">
        <div className="flex-1">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {cardData.title}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">
            {cardData.description}
          </p>
          {/* Break time/date range and duration */}
          {cardData.startDate && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {cardData.breakType === "short_term" ? "Time:" : "Date:"}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {cardData.startDate}
                </span>
              </div>
              {cardData.duration && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Duration:
                  </span>
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                    {cardData.duration}
                  </span>
                </div>
              )}
            </div>
          )}
          {cardData.approverComment && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Approver Comment:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {cardData.approverComment}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {cardData.timestamp}
            </span>
            {shortBreakStatusNode}
          </div>
          {shortBreakStatus === TIMELINE_STATUS.pending && (
            <div className="flex gap-3">
              <Button
                variant="no_style"
                onClick={onShortBreakReject}
                className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Reject
              </Button>
              <Button
                onClick={onShortBreakApprove}
                className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortBreakCard;

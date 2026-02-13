import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { TimelineCardData } from "@/pages/client/my_job_client/types";
import { TIMELINE_STATUS } from "@/constants/timelineConstants";
import type { TimelineStatus } from "@/constants/timelineConstants";

interface JobStartedCardProps {
  isCollapsed: boolean;
  cardData: TimelineCardData;
  accentColor: string;
  jobStatus: TimelineStatus;
  statusNode: React.ReactNode;
  onReject: () => void;
  onApprove: () => void;
}

/**
 * JobStartedCard - Renders job started card with status and approve/reject actions
 */
const JobStartedCard: React.FC<JobStartedCardProps> = ({
  isCollapsed,
  cardData,
  accentColor,
  jobStatus,
  statusNode,
  onReject,
  onApprove,
}) => {
  return (
    <div
      className={`relative rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${
        isCollapsed
          ? "px-4 py-2.5 flex items-center justify-between"
          : "p-4"
      }`}
      style={{ borderColor: accentColor }}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
      {isCollapsed ? (
        <>
          <div className="flex items-center gap-3 pl-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {cardData.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {cardData.timestamp}
            </span>
            {statusNode}
          </div>
        </>
      ) : (
        <div className="flex items-start justify-between gap-4 pl-2">
          <div className="flex-1">
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {cardData.title}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {cardData.timestamp}
              </span>
              {statusNode}
            </div>
            {jobStatus === TIMELINE_STATUS.pending && (
              <div className="flex gap-3">
                <Button
                  variant="no_style"
                  onClick={onReject}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Reject
                </Button>
                <Button
                  onClick={onApprove}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStartedCard;

import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { TimelineCardData } from "@/pages/client/my_job_client/types";
import { TIMELINE_STATUS } from "@/constants/timelineConstants";
import type { TimelineStatus } from "@/constants/timelineConstants";

interface FinalStatementCardProps {
  isCollapsed: boolean;
  cardData: TimelineCardData;
  finalStatementAccentColor: string;
  finalStatementStatus: TimelineStatus;
  finalStatementStatusNode: React.ReactNode;
  onFinalStatementReject: () => void;
  onFinalStatementApprove: () => void;
}

/**
 * FinalStatementCard - Renders final statement card with attachments and actions
 */
const FinalStatementCard: React.FC<FinalStatementCardProps> = ({
  isCollapsed,
  cardData,
  finalStatementAccentColor,
  finalStatementStatus,
  finalStatementStatusNode,
  onFinalStatementReject,
  onFinalStatementApprove,
}) => {
  return (
    <div
      className={`relative rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${
        isCollapsed ? "px-4 py-2.5 flex items-center justify-between" : "p-4"
      }`}
      style={{ borderColor: finalStatementAccentColor }}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: finalStatementAccentColor }}
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
            {finalStatementStatusNode}
          </div>
        </>
      ) : (
        <div className="flex items-start justify-between gap-4 pl-2">
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {cardData.title}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">
              {cardData.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cardData.attachments?.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {attachment.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {cardData.timestamp}
              </span>
              {finalStatementStatusNode}
            </div>
            {finalStatementStatus === TIMELINE_STATUS.pending && (
              <div className="flex gap-3">
                <Button
                  variant="no_style"
                  onClick={onFinalStatementReject}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Reject
                </Button>
                <Button
                  onClick={onFinalStatementApprove}
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

export default FinalStatementCard;

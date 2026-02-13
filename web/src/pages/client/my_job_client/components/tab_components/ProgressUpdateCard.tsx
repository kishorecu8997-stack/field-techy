import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { TimelineCardData } from "@/pages/client/my_job_client/types";
import { TIMELINE_STATUS } from "@/constants/timelineConstants";
import type { TimelineStatus } from "@/constants/timelineConstants";
import type { RevisionRequestDetails } from "./clientTimelineTypes";

interface ProgressUpdateCardProps {
  isCollapsed: boolean;
  cardData: TimelineCardData;
  progressAccentColor: string;
  progressStatus: TimelineStatus;
  progressStatusNode: React.ReactNode;
  revisionRequestDetails: RevisionRequestDetails | null;
  revisionUpdateCardData: TimelineCardData;
  revisionRequestUpdateCardData: TimelineCardData;
  revisionUpdateStatus: TimelineStatus;
  onProgressReject: (keepExpanded?: boolean) => void;
  onRequestRevision: () => void;
  onProgressApprove: (keepExpanded?: boolean) => void;
  onRevisionUpdateRequestRevision: () => void;
}

/**
 * ProgressUpdateCard - Renders progress update card with revision details and action buttons
 */
const ProgressUpdateCard: React.FC<ProgressUpdateCardProps> = ({
  isCollapsed,
  cardData,
  progressAccentColor,
  progressStatus,
  progressStatusNode,
  revisionRequestDetails,
  revisionUpdateCardData,
  revisionRequestUpdateCardData,
  revisionUpdateStatus,
  onProgressReject,
  onRequestRevision,
  onProgressApprove,
  onRevisionUpdateRequestRevision,
}) => {
  return (
    <div
      className={`relative rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${
        isCollapsed
          ? "px-4 py-2.5 flex items-center justify-between"
          : "p-4"
      }`}
      style={{ borderColor: progressAccentColor }}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: progressAccentColor }}
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
            {progressStatusNode}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 pl-2">
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {cardData.title}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {cardData.description}
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                  {cardData.attachments?.[0]?.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {cardData.timestamp}
                </span>
                {progressStatusNode}
              </div>
              {progressStatus === TIMELINE_STATUS.pending && (
                <div className="flex gap-3">
                  <Button
                    variant="no_style"
                    onClick={() => onProgressReject()}
                    className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="no_style"
                    onClick={onRequestRevision}
                    className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Request Revision
                  </Button>
                  <Button
                    onClick={() => onProgressApprove()}
                    className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>

          {progressStatus === TIMELINE_STATUS.revision && revisionRequestDetails && (
            <div className="mt-4 pl-4 border-l border-gray-200">
              <p className="text-xs font-semibold text-gray-800">
                Revision 1 - {revisionRequestDetails.title}
              </p>
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-600">Client:</p>
                    <p className="text-sm text-gray-800 mt-1">
                      {revisionRequestDetails.notes}
                    </p>
                    {revisionRequestDetails.attachmentName && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                          {revisionRequestDetails.attachmentName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 leading-4">
                      {revisionRequestDetails.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-700">Engineer:</p>
                    <p className="text-sm text-gray-800 mt-1">
                      {revisionUpdateCardData.description}
                    </p>
                    {revisionUpdateCardData.attachments?.[0]?.name && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                          {revisionUpdateCardData.attachments[0].name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 leading-4">
                      {revisionRequestUpdateCardData.timestamp}
                    </span>
                  </div>
                </div>
                {revisionUpdateStatus === TIMELINE_STATUS.pending && (
                  <div className="mt-3 flex justify-end gap-3">
                    <Button
                      variant="no_style"
                      onClick={() => onProgressReject(true)}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="no_style"
                      onClick={onRevisionUpdateRequestRevision}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Request Revision
                    </Button>
                    <Button
                      onClick={() => onProgressApprove(true)}
                      className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressUpdateCard;

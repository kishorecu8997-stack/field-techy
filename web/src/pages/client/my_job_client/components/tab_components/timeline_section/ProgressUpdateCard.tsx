import React, { useState } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { HiChevronDown } from "react-icons/hi2";
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
  onRevisionUpdateRequestRevision: (
    logId?: number,
    revisionId?: number,
  ) => void;
  onRevisionUpdateApprove: (
    keepExpanded?: boolean,
    revisionId?: number,
    logId?: number,
  ) => void;
  onRevisionUpdateReject: (
    keepExpanded?: boolean,
    revisionId?: number,
    logId?: number,
  ) => void;
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
  revisionUpdateCardData,
  revisionUpdateStatus,
  onProgressReject,
  onRequestRevision,
  onProgressApprove,
  onRevisionUpdateRequestRevision,
  onRevisionUpdateApprove,
  onRevisionUpdateReject,
}) => {
  // State to toggle showing/hiding revisions after approval/rejection
  const [showRevisions, setShowRevisions] = useState(false);

  // Check if there are revisions to display
  const hasRevisions =
    revisionUpdateCardData.revisions &&
    revisionUpdateCardData.revisions.length > 0;

  // Show icon to view revisions when progress is approved or rejected and there are revisions
  const showRevisionToggle =
    (progressStatus === TIMELINE_STATUS.approved ||
      progressStatus === TIMELINE_STATUS.rejected) &&
    hasRevisions;
  return (
    <div
      className={`relative rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${
        isCollapsed ? "px-4 py-2.5 flex items-center justify-between" : "p-4"
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
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-all">
                {cardData.title}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">
                {cardData.description}
              </p>
              <div className="mt-3">
                {cardData.attachments && cardData.attachments.length > 0 && (
                  <>
                    {cardData.attachments?.[0]?.url ? (
                      <a
                        href={cardData.attachments[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {cardData.attachments[0].name}
                      </a>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                        {cardData.attachments?.[0]?.name}
                      </span>
                    )}
                  </>
                )}
              </div>
              {/* Action buttons below the details */}
              {progressStatus === TIMELINE_STATUS.pending && (
                <div className="flex gap-3 mt-4">
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
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {cardData.timestamp}
                </span>
                {progressStatusNode}
              </div>

              {/* Show icon to view revisions after approval or rejection */}
              {showRevisionToggle && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowRevisions(!showRevisions)}
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    title={
                      showRevisions
                        ? "Hide conversations"
                        : "View conversations"
                    }
                  >
                    <HiChevronDown
                      className={`h-4 w-4 transition-transform ${showRevisions ? "rotate-180" : ""}`}
                    />
                    <span className="text-xs">
                      {revisionUpdateCardData.revisions?.length || 0}{" "}
                      conversation
                      {(revisionUpdateCardData.revisions?.length || 0) !== 1
                        ? "s"
                        : ""}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Show revisions when in revision status OR when toggle is enabled (approved/rejected) */}
          {(progressStatus === TIMELINE_STATUS.revision || showRevisions) &&
            revisionUpdateCardData.revisions &&
            revisionUpdateCardData.revisions.length > 0 && (
              <div className="mt-4 pl-4 border-l border-gray-200 dark:border-gray-600 space-y-4">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Revisions ({revisionUpdateCardData.revisions?.length || 0})
                </p>
                {revisionUpdateCardData.revisions?.map((revision, index) => (
                  <div
                    key={revision.revisionId}
                    className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-900/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                            Revision{" "}
                            {(revisionUpdateCardData.revisions?.length || 0) -
                              index}
                          </p>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                            {revision.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
                          {revision.clientComment || "No comment"}
                        </p>
                        {revision.clientAttachmentUrl && (
                          <div className="mt-2">
                            <a
                              href={revision.clientAttachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50"
                            >
                              📎 Attachment
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500 leading-4">
                          {revision.createdAt
                            ? new Date(revision.createdAt).toLocaleString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )
                            : ""}
                        </span>
                      </div>
                    </div>

                    {/* Engineer Response - shown in blue box when available */}
                    {(revision.content || revision.attachmentUrl) && (
                      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 w-full dark:border-blue-800/50 dark:bg-blue-900/20">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                              Engineer:
                            </p>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap break-all">
                              {revision.content || "No response content"}
                            </p>
                            {revision.attachmentUrl && (
                              <div className="mt-2">
                                <a
                                  href={revision.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  📎{" "}
                                  {
                                    revision.attachmentUrl
                                      .split("/")
                                      .pop()
                                      ?.split("?")[0]
                                  }
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-500 leading-4">
                              {revision.updatedAt
                                ? new Date(revision.updatedAt).toLocaleString(
                                    "en-US",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    },
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {String(revision.status).toLowerCase() === "pending" &&
                      index === 0 &&
                      (revision.content || revision.attachmentUrl) && (
                        <div className="mt-3 flex justify-end gap-3">
                          <Button
                            variant="no_style"
                            onClick={() =>
                              onRevisionUpdateReject(
                                true,
                                revision.revisionId,
                                revision.logId,
                              )
                            }
                            className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Reject
                          </Button>
                          <Button
                            variant="no_style"
                            onClick={() =>
                              onRevisionUpdateRequestRevision(
                                revision.logId,
                                revision.revisionId,
                              )
                            }
                            className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Request Revision
                          </Button>
                          <Button
                            onClick={() =>
                              onRevisionUpdateApprove(
                                true,
                                revision.revisionId,
                                revision.logId,
                              )
                            }
                            className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    {String(revision.status).toLowerCase() === "pending" &&
                      index === 0 &&
                      !revision.content &&
                      !revision.attachmentUrl && (
                        <div className="mt-3 text-sm text-gray-500 italic">
                          Waiting for engineer response...
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default ProgressUpdateCard;

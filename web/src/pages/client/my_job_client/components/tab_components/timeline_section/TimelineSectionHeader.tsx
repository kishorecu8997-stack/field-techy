import React, { useState } from "react";
import { HiChevronDown, HiArrowUturnRight } from "react-icons/hi2";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi";

// Proper type for revision data from API
export interface RevisionData {
  revisionId: number;
  logId: number;
  content: string | null;
  attachmentUrl?: string | null;
  status: string;
  revisions?: Array<{
    revisionId: number;
    content: string | null;
    clientComment: string | null;
    clientAttachmentUrl?: string | null;
    attachmentUrl?: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    status: string;
  }>;
}

interface TimelineSectionHeaderProps {
  items: Array<{
    title: string;
    timestamp: string;
    details?: string | null;
    statusText?: string;
    statusColor?: string;
    accentColor?: string;
    logType?: string;
    logId?: number;
    approverComment?: string | null;
    attachmentUrl?: string | null;
    attachmentName?: string;
    attachments?: Array<{ name: string; url: string }>;
    // Break request specific fields
    startDate?: string;
    endDate?: string;
    breakType?: "short_term" | "long_term";
    duration?: string;
    detailsType?: string;
    detailsLabel?: string;
  }>;
  apiRevisionUpdateDataList?: RevisionData[];
}

/**
 * TimelineSectionHeader - Renders the activity timeline header and list
 * With support for expandable revision conversations (matches engineer timeline style)
 */
const TimelineSectionHeader: React.FC<TimelineSectionHeaderProps> = ({
  items,
  apiRevisionUpdateDataList = [],
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const hasRevisions = (item: {
    logType?: string;
    logId?: number;
  }): boolean => {
    if (item.logType !== "progress_update" && item.logType !== "SUBMISSION") {
      return false;
    }
    const revisionData = apiRevisionUpdateDataList.find(
      (rev) => rev.logId === item.logId,
    );
    return !!(
      revisionData &&
      revisionData.revisions &&
      revisionData.revisions.length > 0
    );
  };

  const getRevisions = (item: { logId?: number }) => {
    const revisionData = apiRevisionUpdateDataList.find(
      (rev) => rev.logId === item.logId,
    );
    return revisionData?.revisions || [];
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Activity Timeline
      </h3>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const itemKey = `${item.title}-${idx}`;
          const isExpanded = expandedItems.has(itemKey);
          const itemHasRevisions = hasRevisions(item);
          const revisions = getRevisions(item);
          const hasApproverComment = !!item.approverComment;
          const shouldShowExpandButton = itemHasRevisions || hasApproverComment;

          // Engineer timeline style: border-gray-200 bg-gray-50 rounded-lg p-4 shadow-sm
          return (
            <div
              key={itemKey}
              className="relative border border-gray-200 bg-gray-50 rounded-lg p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
            >
              {/* Accent bar on left */}
              <span
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                style={{
                  backgroundColor: item.accentColor || "#3b82f6",
                }}
                aria-hidden
              />

              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-5">
                    {item.title}
                    {/* Show break time/date for break items */}
                    {item.detailsType === "break" && item.startDate && (
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        ({item.startDate}{item.duration ? ` - ${item.duration}` : ""})
                      </span>
                    )}
                  </p>
                  {item.details && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">
                      {item.details}
                    </p>
                  )}
                  {/* Attachment display for progress updates and final statements */}
                  {item.attachmentUrl && (
                    <div className="mt-2">
                      <a
                        href={item.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <svg
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        {/* Show different label based on logType */}
                        {item.logType === "FINAL_STATEMENT" ||
                        item.logType === "final_statement"
                          ? "Signature"
                          : item.logType === "WORK_SUBMISSION" ||
                              item.logType === "work_submission" ||
                              item.logType === "SUBMISSION"
                            ? "Work Submission"
                            : "View Document"}
                      </a>
                    </div>
                  )}
                  {/* Display multiple attachments (for final statements) */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <svg
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                  {isExpanded && item.approverComment && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Approver Comment:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                        {item.approverComment}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {/* Expand/collapse button - shows when there are revisions OR approver comment */}
                  {shouldShowExpandButton && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(itemKey)}
                      className="h-7 w-7 min-w-0 p-0 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100 flex items-center justify-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <HiChevronDown
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 leading-4">
                    {item.timestamp}
                  </span>
                  {item.statusText && (
                    <span
                      className="text-xs font-medium flex items-center gap-1"
                      style={{
                        color: item.statusColor || "#3b82f6",
                      }}
                    >
                      {item.statusText.toLowerCase() === "approved" ? (
                        <HiCheckCircle aria-hidden className="h-3.5 w-3.5" />
                      ) : item.statusText.toLowerCase() === "rejected" ? (
                        <HiXCircle aria-hidden className="h-3.5 w-3.5" />
                      ) : item.statusText.toLowerCase() ===
                          "revision requested" ||
                        item.statusText.toLowerCase() ===
                          "revision_requested" ? (
                        <HiArrowUturnRight
                          aria-hidden
                          className="h-3.5 w-3.5"
                        />
                      ) : (
                        <HiClock aria-hidden className="h-3.5 w-3.5" />
                      )}
                      {item.statusText}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded revision conversation - engineer timeline style */}
              {isExpanded && itemHasRevisions && revisions.length > 0 && (
                <div className="mt-3 pl-4 border-l border-gray-200 dark:border-gray-600">
                  {revisions.map((revision, revIdx: number) => (
                    <div key={revision.revisionId || revIdx} className="mb-3">
                      {/* Client message in amber box */}
                      {revision.clientComment && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 w-full dark:border-amber-800/50 dark:bg-amber-900/20">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                Client:
                              </p>
                              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-all">
                                {revision.clientComment}
                              </p>
                              {revision.clientAttachmentUrl && (
                                <div className="mt-2">
                                  <a
                                    href={revision.clientAttachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                                  >
                                    <svg
                                      className="h-4 w-4 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                      />
                                    </svg>
                                    {
                                      revision.clientAttachmentUrl
                                        .split("/")
                                        .pop()
                                        ?.split("?")[0]
                                    }
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400 leading-4">
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
                                  : item.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Engineer message in blue box */}
                      {revision.content && (
                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3 w-full dark:border-blue-800/50 dark:bg-blue-900/20">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                Engineer:
                              </p>
                              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-all">
                                {revision.content}
                              </p>
                              {revision.attachmentUrl && (
                                <div className="mt-2">
                                  <a
                                    href={revision.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                                  >
                                    <svg
                                      className="h-4 w-4 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                      />
                                    </svg>
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
                              <span className="text-xs text-gray-500 dark:text-gray-400 leading-4">
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
                                  : item.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineSectionHeader;

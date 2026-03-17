import React from "react";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi";
import { cn } from "./../libs/utils";
import type { TimelineListProps } from "./types";
import { TIMELINE_LIST_DEFAULTS } from "./types";

/**
 * Shared timeline list that renders compact status rows with accent bars.
 * Accepts an array of timeline items and optional container className.
 * Displays title, timestamp, and optional status text with icon coloring.
 * Falls back to defaults for accent/status colors when not provided.
 * Returns null when no items are supplied to avoid empty wrappers.
 */
const TimelineList: React.FC<TimelineListProps> = ({ items, className }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {items.map((item, idx) => {
        const statusLower = item.statusText?.toLowerCase() || "";
        const isApproved = statusLower === "approved";
        const isRejected = statusLower === "rejected";
        const isRevisionRequested =
          statusLower === "revision requested" ||
          statusLower === "revision_requested";

        return (
          <div
            key={`${item.title}-${idx}`}
            className="relative flex min-h-[48px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-3.5 py-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{
                backgroundColor:
                  item.accentColor || TIMELINE_LIST_DEFAULTS.accentColor,
              }}
              aria-hidden
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-5">
                  {item.title}
                </span>
                {/* Support multiple attachments */}
                {item.attachments && item.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.attachments.map((attachment, idx) => (
                      <a
                        key={idx}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-gray-500"
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
                        {attachment.name || "View Document"}
                      </a>
                    ))}
                  </div>
                )}
                {/* Legacy single attachment support */}
                {!item.attachments && item.attachmentUrl && (
                  <a
                    href={item.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-gray-500"
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
                    {/* Use explicit attachmentLabel if provided, otherwise fall back to attachmentName or default */}
                    {item.attachmentLabel || item.attachmentName || "View Document"}
                  </a>
                )}
              </div>
              {(item.details || item.description) && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-all">
                  {item.details || item.description}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-4">
                {item.timestamp}
              </span>
              {item.statusText && (
                <span
                  className="text-xs font-medium flex items-center gap-1"
                  style={{
                    color:
                      item.statusColor || TIMELINE_LIST_DEFAULTS.statusColor,
                  }}
                >
                  {isApproved ? (
                    <HiCheckCircle aria-hidden />
                  ) : isRejected ? (
                    <HiXCircle aria-hidden />
                  ) : isRevisionRequested ? (
                    <HiClock aria-hidden />
                  ) : (
                    <HiClock aria-hidden />
                  )}
                  {item.statusText}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineList;

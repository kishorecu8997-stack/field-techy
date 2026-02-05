import React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { cn } from "./../libs/utils";
import { TIMELINE_LIST_DEFAULTS } from "@/dummy_data/timelineListDummyData";

export type TimelineItem = {
  title: string;
  timestamp: string;
  accentColor?: string;
  statusText?: string;
  statusColor?: string;
};

interface TimelineListProps {
  items: TimelineItem[];
  className?: string;
}

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
        const isApproved = item.statusText?.toLowerCase() === "approved";

        return (
          <div
            key={`${item.title}-${idx}`}
            className="relative flex min-h-[48px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-3.5 py-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: item.accentColor || TIMELINE_LIST_DEFAULTS.accentColor }}
              aria-hidden
            />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-5">
                {item.title}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-4">
                {item.timestamp}
              </span>
              {item.statusText && (
                <span
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color: item.statusColor || TIMELINE_LIST_DEFAULTS.statusColor }}
                >
                  {isApproved ? (
                    <HiCheckCircle aria-hidden />
                  ) : (
                    <span aria-hidden>⏱</span>
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

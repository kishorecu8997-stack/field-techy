import React from "react";
import { HiCheckCircle, HiClock } from "react-icons/hi";
import { HiArrowUturnRight, HiChevronDown } from "react-icons/hi2";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { ProgressUpdate } from "../../types.d";
import RevisionDetails from "./RevisionDetails";
import { TIMELINE_COLORS, LABELS } from "@/constants/timelineConstants";
import { REVISION_UPDATE_LABELS } from "@/constants/revisionUpdateConstants";
import { FINAL_STATEMENT_LABELS } from "@/constants/finalStatementConstants";

interface ProgressUpdateItemProps {
  update: ProgressUpdate;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: (key: string, isCollapsed: boolean) => void;
  onOpenBreakDetails: (update: ProgressUpdate) => void;
  onStartRevisionUpdate: (update: ProgressUpdate) => void;
  revisionUpdateEntry: ProgressUpdate | undefined;
  STATUS: { APPROVED: string; REVISION_REQUESTED: string };
}

/**
 * ProgressUpdateItem - Renders a single progress update with conditional revision/break details
 * Handles collapse/expand, status display, and nested revision UI
 */
const ProgressUpdateItem: React.FC<ProgressUpdateItemProps> = ({
  update,
  index,
  isCollapsed,
  onToggleCollapse,
  onOpenBreakDetails,
  onStartRevisionUpdate,
  revisionUpdateEntry,
  STATUS,
}) => {
  const updateKey = `${update.title || "update"}-${index}`;
  const isApproved = update.statusText
    ?.toLowerCase()
    .startsWith(STATUS.APPROVED);
  const isRevisionRequested = update.statusText
    ?.toLowerCase()
    .startsWith(STATUS.REVISION_REQUESTED);
  const hasBreakDetails = update.detailsType === "break" && isApproved;
  const isBreakUpdate = update.detailsType === "break";

  const updateTitle =
    update.title === REVISION_UPDATE_LABELS.title
      ? update.title
      : update.title === FINAL_STATEMENT_LABELS.title
        ? update.title
        : update.detailsType === "break"
          ? update.title
          : update.detailsType === "revision"
            ? LABELS.progressUpdateFallback
            : update.title && update.title !== "Progress Update"
              ? `${LABELS.progressUpdateFallback} - ${update.title}`
              : LABELS.progressUpdateFallback;

  return (
    <div
      key={`${update.title}-${index}`}
      className="relative border border-gray-200 bg-gray-50 rounded-lg p-4 shadow-sm"
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{
          backgroundColor: update.accentColor || TIMELINE_COLORS.accentGreen,
        }}
        aria-hidden
      />
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 leading-5">
            {updateTitle}
          </p>
          {!isCollapsed && update.description && (
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-5">
              {update.description}
            </p>
          )}
          {!isCollapsed && update.attachmentName && (
            <a
              href={update.attachmentUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors"
              onClick={(e) => {
                if (!update.attachmentUrl) {
                  e.preventDefault();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {update.attachmentName}
            </a>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 whitespace-nowrap">
          {!isBreakUpdate && (
            <Button
              type="button"
              variant="outline"
              className="h-7 w-7 min-w-0 p-0 rounded-full border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100"
              aria-label={
                isCollapsed
                  ? "Expand progress update"
                  : "Collapse progress update"
              }
              onClick={() => onToggleCollapse(updateKey, isCollapsed)}
            >
              <HiChevronDown
                className={`h-4 w-4 transition-transform ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
                aria-hidden
              />
            </Button>
          )}
          <span className="text-xs text-gray-500 leading-4">
            {update.timestamp}
          </span>
          {update.statusText && (
            <span
              className="text-xs font-medium flex items-center gap-1"
              style={{
                color: update.statusColor || TIMELINE_COLORS.defaultStatus,
              }}
            >
              {isApproved ? (
                <HiCheckCircle aria-hidden />
              ) : isRevisionRequested ? (
                <HiArrowUturnRight aria-hidden />
              ) : (
                <HiClock aria-hidden />
              )}
              {update.statusText}
            </span>
          )}
          {hasBreakDetails && (
            <button
              type="button"
              className="text-xs font-semibold text-teal-700 underline underline-offset-2 mt-1 cursor-pointer"
              onClick={() => onOpenBreakDetails(update)}
            >
              {update.detailsLabel || LABELS.breakDetailsFallback}
            </button>
          )}
        </div>
      </div>

      {/* Revision Details Section - Show only when there are revisions OR when status is revision_requested */}
      {!isCollapsed && ((isRevisionRequested || isApproved || update.statusText?.toLowerCase().includes("pending")) && update.revisions && update.revisions.length > 0) && (
        <RevisionDetails
          update={update}
          onStartRevisionUpdate={onStartRevisionUpdate}
          revisionUpdateEntry={revisionUpdateEntry}
        />
      )}
    </div>
  );
};

export default ProgressUpdateItem;

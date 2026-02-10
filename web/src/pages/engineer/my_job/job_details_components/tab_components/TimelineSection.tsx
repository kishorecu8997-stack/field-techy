import React, { useState } from "react";
import { HiCheckCircle, HiClock } from "react-icons/hi";
import { HiArrowUturnRight, HiChevronDown, HiXMark } from "react-icons/hi2";
import TimelineList from "@/shared/components/TimelineList";
import { Button } from "@/shared/components/commonUI/Buttons";
import { formatDateTime } from "@/utils/formatDateTime";
import type { OfferedJobStatusType } from "@/pages/engineer/search_result/types";
import type { ProgressUpdate } from "../../types.d";
import Popup from "@/shared/components/Popup";
import revisionImage from "@/assets/dummy/revision-request.jpg";
import RevisionRequestUpdateForm from "../jobHeaderComponents/RevisionRequestUpdateForm";
import {
  BASE_TIMELINE_ITEMS,
  JOB_STARTED_TEMPLATE,
  MODAL_MESSAGES,
} from "@/dummy_data/engineerTimelineDummyData";
import { REVISION_UPDATE_LABELS } from "../jobHeaderComponents/RevisionRequestUpdateForm";
import { FINAL_STATEMENT_LABELS } from "../jobHeaderComponents/FinalStatementForm";

const MODAL_TITLES = {
  revisionRequest: "Revision Request",
  breakRequestApproved: "Break Request Approved",
} as const;

const TIMELINE_COLORS = {
  waiting: "#f59e0b",
  approved: "#22c55e",
  defaultStatus: "#f97316",
  accentGreen: "#22c55e",
} as const;

const ATTACHMENT_ALT = {
  revision: "Attachment",
} as const;

const LABELS = {
  progressUpdateFallback: "Progress Update",
  breakDetailsFallback: "Break Request Details",
  breakTitleFallback: "Short Term Break",
} as const;

const REVISION_LABELS = {
  numberPrefix: "Revision",
  clientLabel: "Client:",
  engineerLabel: "Engineer:",
  updateButton: "Update",
} as const;

/**
 * Engineer job timeline tab that renders milestones, progress updates, and revision/break details.
 * Accepts optional `OfferJobStatus` and streamed `progressUpdates` to prepend live events.
 * Uses dummy data templates for base items; stitches in job-start entries when started.
 * Provides popups for revision requests and break details, plus a form to respond to revisions.
 * Status chips/icons and accent colors visually communicate state changes per entry.
 * Designed as a presentational component; network calls are simulated via props.
 */
const formatNow = () => formatDateTime();

const formatDateToMMDDYYYY = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const TimelineSection: React.FC<{
  OfferJobStatus?: OfferedJobStatusType;
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
}> = ({ OfferJobStatus, progressUpdates = [], onAddProgressUpdate }) => {
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [activeRevision, setActiveRevision] =
    useState<ProgressUpdate | null>(null);
  const [isRevisionUpdateFormOpen, setIsRevisionUpdateFormOpen] = useState(false);
  const [isBreakDetailsOpen, setIsBreakDetailsOpen] = useState(false);
  const [activeBreak, setActiveBreak] = useState<ProgressUpdate | null>(null);
  const [collapsedUpdates, setCollapsedUpdates] = useState<Record<string, boolean>>({});

  const handleCloseRevision = () => {
    setIsRevisionOpen(false);
    setActiveRevision(null);
  };

  const handleOpenRevisionUpdateForm = () => {
    setIsRevisionOpen(false);
    setIsRevisionUpdateFormOpen(true);
  };

  const handleStartRevisionUpdate = (update: ProgressUpdate) => {
    setActiveRevision(update);
    setIsRevisionUpdateFormOpen(true);
  };

  const handleCloseRevisionUpdateForm = () => {
    setIsRevisionUpdateFormOpen(false);
  };

  const handleOpenBreakDetails = (update: ProgressUpdate) => {
    setActiveBreak(update);
    setIsBreakDetailsOpen(true);
  };

  const handleCloseBreakDetails = () => {
    setActiveBreak(null);
    setIsBreakDetailsOpen(false);
  };
  const now = formatNow();
  const jobStartedItems = JOB_STARTED_TEMPLATE.map((item) => ({
    ...item,
    timestamp: now,
  }));

  const timelineItems =
    OfferJobStatus === "started"
      ? [...jobStartedItems, ...BASE_TIMELINE_ITEMS]
      : BASE_TIMELINE_ITEMS;
  const revisionUpdateEntry = progressUpdates.find(
    (entry) => entry.title === REVISION_UPDATE_LABELS.title,
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {progressUpdates.length > 0 && (
        <div className="space-y-3 mb-4">
          {progressUpdates.map((update, idx) => {
            if (update.title === REVISION_UPDATE_LABELS.title) return null;
            const updateKey = `${update.title || "update"}-${idx}`;
            const isCollapsed = collapsedUpdates[updateKey] ?? false;
            const updateTitle = update.title === REVISION_UPDATE_LABELS.title
              ? update.title
              : update.title === FINAL_STATEMENT_LABELS.title
                ? update.title
                : update.detailsType === "break"
                  ? update.title
                  : update.title
                    ? `${LABELS.progressUpdateFallback} - ${update.title}`
                    : LABELS.progressUpdateFallback;
            const isApproved = update.statusText?.toLowerCase().startsWith("approved");
            const isRevisionRequested =
              update.statusText?.toLowerCase().startsWith("revision requested");
            const hasBreakDetails =
              update.detailsType === "break" && isApproved;
            const isBreakUpdate = update.detailsType === "break";
            return (
              <div
                key={`${update.title}-${idx}`}
                className="relative border border-gray-200 bg-gray-50 rounded-lg p-4 shadow-sm"
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: update.accentColor || TIMELINE_COLORS.accentGreen }}
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
                      <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                        {update.attachmentName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 whitespace-nowrap">
                    {!isBreakUpdate && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-7 w-7 min-w-0 p-0 rounded-full border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                        aria-label={isCollapsed ? "Expand progress update" : "Collapse progress update"}
                        onClick={() =>
                          setCollapsedUpdates((prev) => ({
                            ...prev,
                            [updateKey]: !isCollapsed,
                          }))
                        }
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
                        style={{ color: update.statusColor || TIMELINE_COLORS.defaultStatus }}
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
                        onClick={() => handleOpenBreakDetails(update)}
                      >
                        {update.detailsLabel || LABELS.breakDetailsFallback}
                      </button>
                    )}
                  </div>
                </div>
                {!isCollapsed && isRevisionRequested && (
                  <div className="mt-3 pl-4 border-l border-gray-200">
                    <p className="text-xs font-semibold text-gray-800">
                      {REVISION_LABELS.numberPrefix} 1 - {update.title}
                    </p>
                    <div className="mt-2">
                      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 w-full">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-amber-600">{REVISION_LABELS.clientLabel}</p>
                            <p className="text-sm text-gray-800 mt-1">
                              {update.description || MODAL_MESSAGES.revisionFallback}
                            </p>
                            {update.attachmentName && (
                              <div className="mt-2">
                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                                  {update.attachmentName}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-500 leading-4">
                              {update.timestamp}
                            </span>
                            {!revisionUpdateEntry && (
                              <Button
                                type="button"
                                className="bg-teal-800 hover:bg-teal-900 text-white px-2 py-0.5 text-xs mt-auto"
                                onClick={() => handleStartRevisionUpdate(update)}
                              >
                                {REVISION_LABELS.updateButton}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {revisionUpdateEntry && (
                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3 w-full">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-blue-700">{REVISION_LABELS.engineerLabel}</p>
                              <p className="text-sm text-gray-800 mt-1">
                                {revisionUpdateEntry.description}
                              </p>
                              {revisionUpdateEntry.attachmentName && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                                    {revisionUpdateEntry.attachmentName}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-gray-500 leading-4">
                                {revisionUpdateEntry.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <TimelineList items={timelineItems} />
      <Popup open={isRevisionOpen} onClose={handleCloseRevision}>
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
          <div className="flex items-center justify-between px-5 pt-5">
            <h3 className="text-lg font-semibold text-gray-900">
              {MODAL_TITLES.revisionRequest}
            </h3>
            <button
              type="button"
              onClick={handleCloseRevision}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
          <div className="px-5 pt-3 text-sm text-gray-700">
            {activeRevision?.description ||
              MODAL_MESSAGES.revisionFallback}
          </div>
          <div className="px-5 pt-4 text-sm font-semibold text-gray-900">
            Attachment
          </div>
          <div className="px-5 pt-2">
            <div className="rounded-md border border-gray-200 bg-gray-100 p-2">
              <img
                src={revisionImage}
                alt={activeRevision?.attachmentName || ATTACHMENT_ALT.revision}
                className="w-full h-44 object-cover rounded"
              />
            </div>
          </div>
          <div className="flex justify-end px-5 py-4">
            <button
              type="button"
              className="bg-teal-800 text-white px-6 py-2 rounded-md text-sm font-medium cursor-pointer"
              onClick={handleOpenRevisionUpdateForm}
            >
              Update
            </button>
          </div>
        </div>
      </Popup>
      <Popup open={isRevisionUpdateFormOpen} onClose={handleCloseRevisionUpdateForm}>
        <RevisionRequestUpdateForm onClose={handleCloseRevisionUpdateForm} onAddProgressUpdate={onAddProgressUpdate} />
      </Popup>
      <Popup open={isBreakDetailsOpen} onClose={handleCloseBreakDetails}>
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
          <div className="flex items-center justify-between px-5 pt-5">
            <h3 className="text-lg font-semibold text-gray-900">
              {MODAL_TITLES.breakRequestApproved}
            </h3>
            <button
              type="button"
              onClick={handleCloseBreakDetails}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
          <div className="px-5 pb-4">
            <div className="border rounded-lg p-4 bg-white">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {activeBreak?.title || LABELS.breakTitleFallback}
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 text-white text-xs font-semibold mb-2">
                {activeBreak?.requestType === "Long Term Break" || activeBreak?.startDate || activeBreak?.endDate
                  ? `${formatDateToMMDDYYYY(activeBreak?.startDate)} to ${formatDateToMMDDYYYY(activeBreak?.endDate)}`
                  : `${activeBreak?.startTime || "-"} to ${activeBreak?.endTime || "-"}`}
                {activeBreak?.duration ? ` - ${activeBreak.duration}` : ""}
              </div>
              {activeBreak?.reason && (
                <p className="text-sm text-gray-800 mb-1">
                  {activeBreak.reason}
                </p>
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
    </div>
  );
};

export default TimelineSection;

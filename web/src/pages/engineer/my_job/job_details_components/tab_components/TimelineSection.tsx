import React, { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { HiArrowUturnRight, HiXMark } from "react-icons/hi2";
import TimelineList from "@/shared/components/TimelineList";
import type { OfferedJobStatusType } from "@/pages/engineer/search_result/types";
import type { ProgressUpdate } from "../../types.d";
import Popup from "@/shared/components/Popup";
import revisionImage from "@/assets/dummy/revision-request.jpg";
import RevisionRequestUpdateForm from "../jobHeaderComponents/RevisionRequestUpdateForm";
import {
  BASE_TIMELINE_ITEMS,
  JOB_STARTED_TEMPLATE,
  TIMELINE_COLORS,
  MODAL_TITLES,
  MODAL_MESSAGES,
  ATTACHMENT_ALT,
  LABELS,
} from "@/dummy_data/engineerTimelineDummyData";

/**
 * Engineer job timeline tab that renders milestones, progress updates, and revision/break details.
 * Accepts optional `OfferJobStatus` and streamed `progressUpdates` to prepend live events.
 * Uses dummy data templates for base items; stitches in job-start entries when started.
 * Provides popups for revision requests and break details, plus a form to respond to revisions.
 * Status chips/icons and accent colors visually communicate state changes per entry.
 * Designed as a presentational component; network calls are simulated via props.
 */
const formatNow = () =>
  new Date().toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

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

  const handleOpenRevision = (update: ProgressUpdate) => {
    setActiveRevision(update);
    setIsRevisionOpen(true);
  };

  const handleCloseRevision = () => {
    setIsRevisionOpen(false);
    setActiveRevision(null);
  };

  const handleOpenRevisionUpdateForm = () => {
    setIsRevisionOpen(false);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {progressUpdates.length > 0 && (
        <div className="space-y-3 mb-4">
          {progressUpdates.map((update, idx) => {
            const isApproved = update.statusText?.toLowerCase() === "approved";
            const isRevisionRequested =
              update.statusText?.toLowerCase() === "revision requested";
            const hasBreakDetails =
              update.detailsType === "break" && isApproved;
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
                      {update.title || LABELS.progressUpdateFallback}
                    </p>
                    {update.description && (
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-5">
                        {update.description}
                      </p>
                    )}
                    {update.attachmentName && (
                      <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                        {update.attachmentName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 whitespace-nowrap">
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
                          <span aria-hidden>⏱</span>
                        )}
                        {update.statusText}
                      </span>
                    )}
                    {isRevisionRequested && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-teal-700 underline underline-offset-2 mt-1 cursor-pointer"
                        onClick={() => handleOpenRevision(update)}
                      >
                        Revision Request Details
                      </button>
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
                {(activeBreak?.startTime || "-") + " to " + (activeBreak?.endTime || "-")}
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

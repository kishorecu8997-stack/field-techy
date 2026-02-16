import React, { useState } from "react";
import TimelineList from "@/shared/components/TimelineList";
import { formatNow } from "@/utils/formatDateTime";
import type { OfferedJobStatusType, ProgressUpdate } from "../../types.d";
import type { AssignmentStatus } from "@/pages/engineer/search_result/types";
import Popup from "@/shared/components/Popup";
import RevisionRequestUpdateForm from "../jobHeaderComponents/RevisionRequestUpdateForm";
import ProgressUpdateItem from "./ProgressUpdateItem";
import RevisionModal from "./RevisionModal";
import BreakDetailsModal from "./BreakDetailsModal";
import {
  BASE_TIMELINE_ITEMS,
  JOB_STARTED_TEMPLATE,
} from "@/dummy_data/engineerTimelineDummyData";
import { REVISION_UPDATE_LABELS } from "@/constants/revisionUpdateConstants";
import { ENGINEER_TIMELINE_STATUS } from "@/constants/timelineConstants";

/**
 * Engineer job timeline tab that renders milestones, progress updates, and revision/break details.
 * Accepts optional `OfferJobStatus` and streamed `progressUpdates` to prepend live events.
 * Uses dummy data templates for base items; stitches in job-start entries when started.
 * Provides popups for revision requests and break details, plus a form to respond to revisions.
 * Status chips/icons and accent colors visually communicate state changes per entry.
 * Designed as a presentational component; network calls are simulated via props.
 */
const TimelineSection: React.FC<{
  OfferJobStatus?: OfferedJobStatusType | AssignmentStatus;
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
}> = ({ OfferJobStatus, progressUpdates = [], onAddProgressUpdate }) => {
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [activeRevision, setActiveRevision] = useState<ProgressUpdate | null>(
    null,
  );
  const [isRevisionUpdateFormOpen, setIsRevisionUpdateFormOpen] =
    useState(false);
  const [isBreakDetailsOpen, setIsBreakDetailsOpen] = useState(false);
  const [activeBreak, setActiveBreak] = useState<ProgressUpdate | null>(null);
  const [collapsedUpdates, setCollapsedUpdates] = useState<
    Record<string, boolean>
  >({});

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

            return (
              <ProgressUpdateItem
                key={`${update.title}-${idx}`}
                update={update}
                index={idx}
                isCollapsed={isCollapsed}
                onToggleCollapse={(_, collapsed) =>
                  setCollapsedUpdates((prev) => ({
                    ...prev,
                    [updateKey]: !collapsed,
                  }))
                }
                onOpenBreakDetails={handleOpenBreakDetails}
                onStartRevisionUpdate={handleStartRevisionUpdate}
                revisionUpdateEntry={revisionUpdateEntry}
                STATUS={ENGINEER_TIMELINE_STATUS}
              />
            );
          })}
        </div>
      )}
      <TimelineList items={timelineItems} />

      {/* Revision Modal */}
      <RevisionModal
        isOpen={isRevisionOpen}
        onClose={handleCloseRevision}
        activeRevision={activeRevision}
        onOpenUpdateForm={handleOpenRevisionUpdateForm}
      />

      {/* Revision Update Form Modal */}
      <Popup
        open={isRevisionUpdateFormOpen}
        onClose={handleCloseRevisionUpdateForm}
      >
        <RevisionRequestUpdateForm
          onClose={handleCloseRevisionUpdateForm}
          onAddProgressUpdate={onAddProgressUpdate}
        />
      </Popup>

      {/* Break Details Modal */}
      <BreakDetailsModal
        isOpen={isBreakDetailsOpen}
        onClose={handleCloseBreakDetails}
        activeBreak={activeBreak}
      />
    </div>
  );
};

export default TimelineSection;

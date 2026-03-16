import React, { useState, useMemo } from "react";
import TimelineSectionHeader from "@/pages/client/my_job_client/components/tab_components/timeline_section/TimelineSectionHeader";
import ActionRequiredBadge from "@/pages/client/my_job_client/components/tab_components/timeline_section/ActionRequiredBadge";
import {
  formatApiDate,
  transformLogsToTimelineItems,
  transformBreakRequestsToItems,
  transformSignOffsToItems,
} from "@/utils/timelineUtils";
import { getAttachmentFileName } from "@/shared/libs/utils";
import type { ProgressUpdate } from "../../types.d";
import Popup from "@/shared/components/Popup";
import RevisionRequestUpdateForm from "../jobHeaderComponents/RevisionRequestUpdateForm";
import ProgressUpdateItem from "./ProgressUpdateItem";
import RevisionModal from "./RevisionModal";
import BreakDetailsModal from "./BreakDetailsModal";
import { REVISION_UPDATE_LABELS } from "@/constants/revisionUpdateConstants";
import { ENGINEER_TIMELINE_STATUS } from "@/constants/timelineConstants";
import {
  useGetJobLogs,
  useEngineerGetMyJobs,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import type { EngineerGetMyJobsResponse } from "@/api";

const transformProposalToTimelineItems = (
  jobs: EngineerGetMyJobsResponse,
  currentJobId?: number,
) => {
  if (!jobs || jobs.length === 0) return [];

  const relevantJobs = currentJobId
    ? jobs.filter((job) => job.id === currentJobId)
    : jobs;

  const allItems: Array<{
    title: string;
    timestamp: string;
    statusText: string;
    statusColor: string;
    accentColor: string;
    details: string | null;
    attachmentUrl?: string | null;
    attachmentName?: string;
    sortOrder: number;
  }> = [];

  relevantJobs.forEach((job) => {
    if (job.assignmentStatus === "rejected") {
      const rejectedTimestamp = job.respondedAt;
      if (rejectedTimestamp) {
        allItems.push({
          title: "Proposal Rejected",
          timestamp: formatApiDate(rejectedTimestamp),
          statusText: "",
          statusColor: "#ef4444",
          accentColor: "#ef4444",
          details: "",
          sortOrder: 100,
        });
      }
    }

    if (
      job.assignmentStatus === "started" ||
      job.assignmentStatus === "submitted"
    ) {
      const startedTimestamp =
        (job as { startedAt?: string | null }).startedAt ||
        job.assignedAt ||
        job.respondedAt;
      if (startedTimestamp) {
        allItems.push({
          title: "Job Started",
          timestamp: formatApiDate(startedTimestamp),
          statusText: "Approved",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: "",
          sortOrder: 100,
        });
      }
    }

    if (job.assignmentStatus === "start_pending_approval") {
      const startPendingTimestamp =
        (job as { startRequestedAt?: string | null }).startRequestedAt ||
        job.respondedAt;
      if (startPendingTimestamp) {
        allItems.push({
          title: "Job Started",
          timestamp: formatApiDate(startPendingTimestamp),
          statusText: "Waiting for approval",
          statusColor: "#f59e0b",
          accentColor: "#f59e0b",
          details: "",
          sortOrder: 100,
        });
      }
    }

    if (
      job.assignmentStatus === "accepted" ||
      job.assignmentStatus === "assigned" ||
      job.assignmentStatus === "start_pending_approval" ||
      job.assignmentStatus === "started" ||
      job.assignmentStatus === "submitted" ||
      job.assignmentStatus === "submit_pending_approval"
    ) {
      const acceptedTimestamp = job.assignedAt || job.respondedAt;
      if (acceptedTimestamp) {
        allItems.push({
          title: "Proposal Accepted",
          timestamp: formatApiDate(acceptedTimestamp),
          statusText: "",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: "",
          sortOrder: 50,
        });
      }
    }

    if (
      job.assignmentStatus === "applied" ||
      job.assignmentStatus === "accepted" ||
      job.assignmentStatus === "rejected" ||
      job.assignmentStatus === "assigned" ||
      job.assignmentStatus === "start_pending_approval" ||
      job.assignmentStatus === "started" ||
      job.assignmentStatus === "submitted" ||
      job.assignmentStatus === "submit_pending_approval"
    ) {
      const submittedTimestamp = job.appliedAt || job.respondedAt;
      if (submittedTimestamp) {
        let proposalDetails = job.proposalDetail
          ? `\n\nProposal Details: ${job.proposalDetail}`
          : `\n\nSubmitted proposal for: ${job.jobTitle}`;

        allItems.push({
          title: "Proposal Submitted",
          timestamp: formatApiDate(submittedTimestamp),
          statusText: "",
          statusColor: "#f59e0b",
          accentColor: "#3b82f6",
          details: proposalDetails,
          sortOrder: 25,
          attachmentUrl: job.proposalAttachmentUrl || undefined,
          attachmentName: job.proposalAttachmentUrl ? "View Attachment" : undefined,
        });
      }
    }

    if (job.createdAt) {
      allItems.push({
        title: "Job Posted",
        timestamp: formatApiDate(job.createdAt),
        statusText: "",
        statusColor: "#3b82f6",
        accentColor: "#3b82f6",
        details: "",
        sortOrder: 0,
      });
    }
  });

  return allItems.sort((a, b) => b.sortOrder - a.sortOrder);
};

const TimelineSection: React.FC<{
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  assignmentId?: number;
  jobId?: number;
  hasApplied?: boolean;
}> = ({
  progressUpdates = [],
  onAddProgressUpdate,
  assignmentId,
  jobId,
  hasApplied = false,
}) => {
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

  const { data: jobLogs, isLoading: isLoadingLogs } = useGetJobLogs(
    assignmentId ?? 0,
    !!assignmentId,
  );

  const { data: engineerJobs } = useEngineerGetMyJobs(!!jobId || !!hasApplied);

  const proposalTimelineItems = useMemo(() => {
    if (
      !engineerJobs ||
      !Array.isArray(engineerJobs) ||
      engineerJobs.length === 0
    )
      return [];
    return transformProposalToTimelineItems(engineerJobs, jobId);
  }, [engineerJobs, jobId]);

  const apiTimelineItems = useMemo(() => {
    if (!jobLogs) return [];

    const logItems = transformLogsToTimelineItems(jobLogs.logs || []);
    const breakItems = transformBreakRequestsToItems(
      jobLogs.breakRequests || [],
    );
    const signOffItems = transformSignOffsToItems(jobLogs.signOffSheets || []);

    const allItems = [...logItems, ...breakItems, ...signOffItems];

    return allItems.sort((a, b) => {
      const dateA = a.effectiveTimestamp
        ? new Date(a.effectiveTimestamp).getTime()
        : 0;
      const dateB = b.effectiveTimestamp
        ? new Date(b.effectiveTimestamp).getTime()
        : 0;
      return dateB - dateA;
    });
  }, [jobLogs]);

  const apiRevisionUpdateDataList = useMemo(() => {
    if (!jobLogs?.logs?.length) return [];

    const revisionDataList = [];

    for (const log of jobLogs.logs) {
      if (
        (log.logType === "progress_update" || log.logType === "SUBMISSION") &&
        log.revisions &&
        log.revisions.length > 0
      ) {
        const revisions = log.revisions.map((rev) => ({
          revisionId: rev.revisionId,
          logId: log.id,
          content: rev.content,
          attachmentUrl: rev.attachment?.url,
          attachmentName: getAttachmentFileName(rev.attachment),
          clientComment: rev.clientComment,
          clientAttachmentUrl: rev.clientAttachment?.url,
          clientAttachmentName: getAttachmentFileName(rev.clientAttachment),
          createdAt: rev.createdAt,
          updatedAt: rev.updatedAt,
          status: rev.status,
        }));

        revisionDataList.push({
          id: `revision-update-${log.id}`,
          logId: log.id,
          revisionId: revisions[0]?.revisionId,
          type: "revisionRequestUpdate" as const,
          title: "Revision Request",
          description: revisions[0]?.clientComment || "",
          timestamp: formatApiDate(revisions[0]?.createdAt),
          revisions: revisions,
          status: revisions[0]?.status,
        });
      }
    }

    return revisionDataList;
  }, [jobLogs]);

  const timelineItems = useMemo(() => {
    const allItems: Array<{
      title: string;
      timestamp: string;
      effectiveTimestamp?: string | null;
      statusText: string;
      statusColor: string;
      accentColor: string;
      details: string | null;
      detailsType?: string;
      attachmentUrl?: string | null;
      attachmentName?: string;
      attachments?: Array<{ name: string; url: string }>;
      sortOrder: number;
      logId?: number;
      logType?: string;
      approverComment?: string | null;
    }> = [];

    if (proposalTimelineItems.length > 0) {
      allItems.push(...proposalTimelineItems);
    }

    if (apiTimelineItems.length > 0) {
      const apiItemsWithSortOrder = apiTimelineItems.map((item, index) => ({
        ...item,
        sortOrder: 200 + index,
      }));
      allItems.push(...apiItemsWithSortOrder);
    }

    return allItems.sort((a, b) => {
      const dateA = a.effectiveTimestamp
        ? new Date(a.effectiveTimestamp).getTime()
        : new Date(a.timestamp).getTime();
      const dateB = b.effectiveTimestamp
        ? new Date(b.effectiveTimestamp).getTime()
        : new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
  }, [apiTimelineItems, proposalTimelineItems]);

  const revisionUpdateEntry = progressUpdates.find(
    (entry) => entry.title === REVISION_UPDATE_LABELS.title,
  );

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

  if (isLoadingLogs) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-500">Loading timeline...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Engineer Action Required: show only when waiting for engineer response */}
      {progressUpdates.length > 0 && (
        <div className="space-y-3 mb-4">
          {(() => {
            const actionRequiredUpdates = progressUpdates.filter((update) => {
              const statusLower = String(update.statusText || "")
                .toLowerCase()
                .trim();

              const revisions = update.revisions || [];
              const latestRevision = revisions[0]; // newest first
              // const latestRevisionStatus = String(latestRevision?.status || "").toLowerCase().trim();

              const isRevisionRequest =
                statusLower.includes("revision requested") ||
                statusLower === "revision_requested" ||
                statusLower.includes("revise requested") ||
                statusLower.includes("needs revision");

              // Show if it's a revision request AND engineer has NOT yet responded.
              // A response can be content-only, attachment-only, or both.
              const engineerHasResponded =
                !!latestRevision?.content || !!latestRevision?.attachmentUrl;

              return isRevisionRequest && !engineerHasResponded;
            });

            const actionRequiredCount = actionRequiredUpdates.length;

            return actionRequiredCount > 0 ? (
              <>
                <ActionRequiredBadge count={actionRequiredCount} />
                {actionRequiredUpdates.map((update, idx) => {
                  if (update.title === REVISION_UPDATE_LABELS.title)
                    return null;

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
              </>
            ) : null;
          })()}
        </div>
      )}

      {/* Activity Timeline */}
      {timelineItems.length > 0 && (
        <TimelineSectionHeader
          items={timelineItems.map((item) => ({
            ...item,
            logId: item.logId,
            logType: item.logType || "progress_update",
          }))}
          apiRevisionUpdateDataList={apiRevisionUpdateDataList}
        />
      )}

      {timelineItems.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No timeline data available yet
        </div>
      )}

      <RevisionModal
        isOpen={isRevisionOpen}
        onClose={handleCloseRevision}
        activeRevision={activeRevision}
        onOpenUpdateForm={handleOpenRevisionUpdateForm}
      />

      <Popup
        open={isRevisionUpdateFormOpen}
        onClose={handleCloseRevisionUpdateForm}
      >
        <RevisionRequestUpdateForm
          onClose={handleCloseRevisionUpdateForm}
          onAddProgressUpdate={onAddProgressUpdate}
          assignmentId={assignmentId}
          logId={
            activeRevision?.revisions?.[0]?.jobLogId ??
            activeRevision?.revisions?.[0]?.logId ??
            activeRevision?.logId
          }
          revisionId={activeRevision?.revisions?.[0]?.revisionId}
        />
      </Popup>

      <BreakDetailsModal
        isOpen={isBreakDetailsOpen}
        onClose={handleCloseBreakDetails}
        activeBreak={activeBreak}
      />
    </div>
  );
};

export default TimelineSection;

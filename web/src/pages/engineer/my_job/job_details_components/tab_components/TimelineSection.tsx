import React, { useState, useMemo } from "react";
import TimelineList from "@/shared/components/TimelineList";
import { formatNow } from "@/utils/formatDateTime";
import type { ProgressUpdate } from "../../types.d";
import Popup from "@/shared/components/Popup";
import RevisionRequestUpdateForm from "../jobHeaderComponents/RevisionRequestUpdateForm";
import ProgressUpdateItem from "./ProgressUpdateItem";
import RevisionModal from "./RevisionModal";
import BreakDetailsModal from "./BreakDetailsModal";
import { REVISION_UPDATE_LABELS } from "@/constants/revisionUpdateConstants";
import { ENGINEER_TIMELINE_STATUS } from "@/constants/timelineConstants";
import { useGetJobLogs, useEngineerGetMyJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import type { GetJobLogsResponse, EngineerGetMyJobsResponse } from "@/api";

/**
 * Format a date string to display format
 */
const formatApiDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return formatNow();
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return formatNow();
  }
};

/**
 * Transform API logs to timeline items with proper labels
 */
const transformLogsToTimelineItems = (logs: GetJobLogsResponse["logs"]) => {
  return logs.map((log) => {
    // Generate proper title based on logType
    let title = log.title || log.logType;
    let details = log.details;
    
    // Customize title based on logType and status
    if (log.logType === "SUBMISSION") {
      if (log.status === "pending" as any) {
        title = "Proposal Submitted";
        details = details || "Engineer submitted a proposal for this job";
      } else if (log.status === "approved") {
        title = "Proposal Accepted";
        details = details || "Client accepted the proposal";
      } else if (log.status === "rejected") {
        title = "Proposal Rejected";
        details = details || "Client rejected the proposal";
      }
    } else if (log.logType === "JOB_POSTED") {
      title = "Job Posted";
      details = details || "Client posted a new job";
    } else if (log.logType === "JOB_STARTED") {
      title = "Job Started";
      details = details || "Work has started on this job";
    } else if (log.logType === "JOB_COMPLETED") {
      title = "Job Completed";
      details = details || "Job has been completed";
    }
    
    return {
      title,
      timestamp: formatApiDate(log.timestamp),
      statusText: log.status.charAt(0).toUpperCase() + log.status.slice(1).replace(/_/g, " "),
      statusColor: log.status === "approved" ? "#22c55e" : log.status === "rejected" ? "#ef4444" : "#f59e0b",
      accentColor: "#3b82f6",
      details,
      attachmentUrl: log.attachmentUrl,
    };
  });
};

/**
 * Transform break requests to timeline items
 */
const transformBreakRequestsToItems = (breakRequests: GetJobLogsResponse["breakRequests"]) => {
  return breakRequests.map((br) => ({
    title: `${br.type === "short_term" ? "Short Term" : "Long Term"} Break`,
    timestamp: formatApiDate(br.createdAt),
    statusText: br.status.charAt(0).toUpperCase() + br.status.slice(1),
    statusColor: br.status === "approved" ? "#22c55e" : br.status === "rejected" ? "#ef4444" : "#f59e0b",
    accentColor: "#8b5cf6",
    details: br.reason,
    startDate: br.startAt,
    endDate: br.endAt,
  }));
};

/**
 * Transform sign-off sheets to timeline items
 */
const transformSignOffsToItems = (signOffs: GetJobLogsResponse["signOffSheets"]) => {
  if (!signOffs) return [];
  return signOffs.map((so) => ({
    title: "Final Statement",
    timestamp: formatApiDate(so.createdAt),
    statusText: so.status.charAt(0).toUpperCase() + so.status.slice(1),
    statusColor: so.status === "approved" ? "#22c55e" : so.status === "rejected" ? "#ef4444" : "#f59e0b",
    accentColor: "#10b981",
    details: so.details,
  }));
};

/**
 * Transform engineer's job/proposal data to timeline items
 */
const transformProposalToTimelineItems = (
  jobs: EngineerGetMyJobsResponse,
  currentJobId?: number
) => {
  if (!jobs || jobs.length === 0) return [];

  // Filter to current job if provided, otherwise get all proposals
  const relevantJobs = currentJobId 
    ? jobs.filter(job => job.id === currentJobId) 
    : jobs;

  const allItems: Array<{
    title: string;
    timestamp: string;
    statusText: string;
    statusColor: string;
    accentColor: string;
    details: string | null;
    sortOrder: number;
  }> = [];

  relevantJobs.forEach((job) => {
    // Add entries in reverse chronological order (most recent first) based on status
    
    // 6. Proposal Rejected entry (if rejected) - most recent for rejected status
    if (job.assignmentStatus === "rejected") {
      const rejectedTimestamp = job.respondedAt;
      if (rejectedTimestamp) {
        allItems.push({
          title: "Proposal Rejected",
          timestamp: formatApiDate(rejectedTimestamp),
          statusText: "",
          statusColor: "#ef4444",
          accentColor: "#ef4444",
          details: `Your proposal for "${job.jobTitle}" was rejected`,
          sortOrder: 100,
        });
      }
    }
    
    // 5. Job Started entry (if started - client approved)
    if (job.assignmentStatus === "started") {
      const startedTimestamp = job.assignedAt || job.respondedAt;
      if (startedTimestamp) {
        allItems.push({
          title: "Job Started",
          timestamp: formatApiDate(startedTimestamp),
          statusText: "Approved",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: `Job "${job.jobTitle}" has started`,
          sortOrder: 100,
        });
      }
    }
    
    // 4. Start Request Pending entry (if start_pending_approval)
    if (job.assignmentStatus === "start_pending_approval") {
      const startPendingTimestamp = job.respondedAt;
      if (startPendingTimestamp) {
        allItems.push({
          title: "Job Started",
          timestamp: formatApiDate(startPendingTimestamp),
          statusText: "Waiting for approval",
          statusColor: "#f59e0b",
          accentColor: "#f59e0b",
          details: `Start request submitted for "${job.jobTitle}" - waiting for client approval`,
          sortOrder: 100,
        });
      }
    }

    // 3. Proposal Accepted entry (if accepted/assigned or later statuses)
    if (job.assignmentStatus === "accepted" || job.assignmentStatus === "assigned" ||
        job.assignmentStatus === "start_pending_approval" || job.assignmentStatus === "started" ||
        job.assignmentStatus === "submitted" || job.assignmentStatus === "submit_pending_approval") {
      const acceptedTimestamp = job.assignedAt || job.respondedAt;
      if (acceptedTimestamp) {
        allItems.push({
          title: "Proposal Accepted",
          timestamp: formatApiDate(acceptedTimestamp),
          statusText: "",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: `Your proposal for "${job.jobTitle}" was accepted!`,
          sortOrder: 50,
        });
      }
    }

    // 2. Proposal Submitted entry (if applied)
    if (job.assignmentStatus === "applied" || job.assignmentStatus === "accepted" || 
        job.assignmentStatus === "rejected" || job.assignmentStatus === "assigned" ||
        job.assignmentStatus === "start_pending_approval" || job.assignmentStatus === "started" ||
        job.assignmentStatus === "submitted" || job.assignmentStatus === "submit_pending_approval") {
      const submittedTimestamp = job.appliedAt || job.respondedAt;
      if (submittedTimestamp) {
        allItems.push({
          title: "Proposal Submitted",
          timestamp: formatApiDate(submittedTimestamp),
          statusText: "",
          statusColor: "#f59e0b",
          accentColor: "#3b82f6",
          details: `Submitted proposal for: ${job.jobTitle}`,
          sortOrder: 25,
        });
      }
    }

    // 1. Job Posted entry (always show this) - oldest event
    if (job.createdAt) {
      allItems.push({
        title: "Job Posted",
        timestamp: formatApiDate(job.createdAt),
        statusText: "",
        statusColor: "#3b82f6",
        accentColor: "#3b82f6",
        details: `New job posted: ${job.jobTitle}`,
        sortOrder: 0,
      });
    }
  });

  // Sort by sortOrder descending (highest first = most recent first)
  return allItems.sort((a, b) => b.sortOrder - a.sortOrder);
};

/**
 * Engineer job timeline tab that renders milestones, progress updates, and revision/break details.
 * Uses real API data from /jobs/assignments/{assignmentId}/logs endpoint.
 * Also uses /jobs/my-job endpoint to get engineer's proposal status.
 * Only shows API data when available, no dummy fallback.
 * When hasApplied is true and no API logs available, shows local "Proposal Submitted" entry.
 */
const TimelineSection: React.FC<{
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  assignmentId?: number;
  jobId?: number;
  hasApplied?: boolean;
}> = ({
  progressUpdates = [], onAddProgressUpdate, assignmentId, jobId, hasApplied = false }) => {
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [activeRevision, setActiveRevision] = useState<ProgressUpdate | null>(null);
  const [isRevisionUpdateFormOpen, setIsRevisionUpdateFormOpen] = useState(false);
  const [isBreakDetailsOpen, setIsBreakDetailsOpen] = useState(false);
  const [activeBreak, setActiveBreak] = useState<ProgressUpdate | null>(null);
  const [collapsedUpdates, setCollapsedUpdates] = useState<
    Record<string, boolean>
  >({});

  // Fetch job logs from real API
  const { data: jobLogs, isLoading: isLoadingLogs } = useGetJobLogs(
    assignmentId ?? 0,
    !!assignmentId,
  );

  // Fetch engineer's jobs to get proposal status
  const { data: engineerJobs } = useEngineerGetMyJobs(!!jobId || !!hasApplied);
  
  // Transform proposal data to timeline items
  const proposalTimelineItems = useMemo(() => {
    if (!engineerJobs || !Array.isArray(engineerJobs) || engineerJobs.length === 0) return [];
    return transformProposalToTimelineItems(engineerJobs, jobId);
  }, [engineerJobs, jobId]);

  // Transform API data to timeline items
  const apiTimelineItems = useMemo(() => {
    if (!jobLogs) return [];

    const logItems = transformLogsToTimelineItems(jobLogs.logs || []);
    const breakItems = transformBreakRequestsToItems(jobLogs.breakRequests || []);
    const signOffItems = transformSignOffsToItems(jobLogs.signOffSheets || []);

    const allItems = [...logItems, ...breakItems, ...signOffItems];
    // Sort by timestamp descending (newest first)
    return allItems.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
  }, [jobLogs]);

  // Build timeline items - combines API logs with proposal data
  const timelineItems = useMemo(() => {
    const allItems: Array<{
      title: string;
      timestamp: string;
      statusText: string;
      statusColor: string;
      accentColor: string;
      details: string | null;
      sortOrder: number;
    }> = [];

    // Add proposal items from engineer jobs API if available
    if (proposalTimelineItems.length > 0) {
      allItems.push(...proposalTimelineItems);
    }

    // Add API logs if available (these will have real timestamps)
    if (apiTimelineItems.length > 0) {
      // Assign sortOrder based on timestamp for API items (higher than proposal items)
      const apiItemsWithSortOrder = apiTimelineItems.map((item, index) => ({
        ...item,
        sortOrder: 200 + index,
      }));
      allItems.push(...apiItemsWithSortOrder);
    }

    // Sort by sortOrder descending (highest first = most recent first)
    return allItems.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
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
      {/* Show progress updates (streamed data) */}
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

      {/* Show API timeline data */}
      <TimelineList items={timelineItems} />

      {/* This message won't show now since we always have at least Job Posted */}
      {timelineItems.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No timeline data available yet
        </div>
      )}

      {/* revision Modal */}
      <RevisionModal
        isOpen={isRevisionOpen}
        onClose={handleCloseRevision}
        activeRevision={activeRevision}
        onOpenUpdateForm={handleOpenRevisionUpdateForm}
      />

      {/* revision Update Form Modal */}
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

import React, { useState, useMemo } from "react";
import TimelineSectionHeader from "@/pages/client/my_job_client/components/tab_components/TimelineSectionHeader";
import ActionRequiredBadge from "@/pages/client/my_job_client/components/tab_components/ActionRequiredBadge";
import { formatNow } from "@/utils/formatDateTime";
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
 * Uses effectiveTimestamp for proper sorting - latest action first
 */
const transformLogsToTimelineItems = (logs: GetJobLogsResponse["logs"]) => {
  const items = logs.map((log) => {
    // Skip creating separate "Revision Request" entries - revisions should only show as nested items under Progress Update
    if (log.status === "revision_requested" && log.logType !== "progress_update") {
      return null;
    }

    // Compute effectiveTimestamp for proper sorting:
    // - For progress_update with revisions: use latest revision.updatedAt
    // - Else use log.updatedAt
    // - Else use log.timestamp
    let effectiveTimestamp: string;
    const logAny = log as any; // Cast to any to handle optional properties
    if (log.logType === "progress_update" && log.revisions && log.revisions.length > 0) {
      // Find the latest revision by updatedAt
      const latestRevision = log.revisions.reduce((latest, rev) => {
        if (!latest) return rev;
        const revDate = rev.updatedAt ? new Date(rev.updatedAt).getTime() : 0;
        const latestDate = latest.updatedAt ? new Date(latest.updatedAt).getTime() : 0;
        return revDate > latestDate ? rev : latest;
      }, log.revisions[0]);
      effectiveTimestamp = latestRevision.updatedAt || log.timestamp || new Date().toISOString();
    } else {
      effectiveTimestamp = logAny.updatedAt || log.timestamp || new Date().toISOString();
    }

    // Generate proper title based on logType
    let title = log.title || log.logType;
    let details = log.details;
    let detailsType: string | undefined;
    let statusText: string | undefined;
    let statusColor: string | undefined;

    // Customize title based on logType and status
    if (log.logType === "SUBMISSION") {
      if (
        log.status ===
        ("pending" as
          | "pending"
          | "approved"
          | "rejected"
          | "revision_requested")
      ) {
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
    } else if (log.logType === "progress_update") {
      title = "Progress Update";
      // Keep original progress update content - don't overwrite with revision comments
      const originalDetails = log.details || "Engineer submitted a progress update";
      
      // Check if client requested revisions - keep "Progress Update" title but mark detailsType for rendering
      if (log.status === "revision_requested") {
        detailsType = "revision";
        // Use original progress update content, NOT the client comment
        details = originalDetails;
      } else {
        details = originalDetails;
      }
      // Check for pending status
      if ((log.status as string) === "pending") {
        statusText = "Pending";
        statusColor = "#f59e0b";
      }
    }

    // Use custom statusText if set (e.g., for progress_update with pending status), otherwise generate from log.status
    const finalStatusText = statusText ||
      (log.status.charAt(0).toUpperCase() + log.status.slice(1).replace(/_/g, " "));
    
    // Use custom statusColor if set, otherwise determine from log.status
    const finalStatusColor = statusColor ||
      (log.status === "approved"
        ? "#22c55e"
        : log.status === "rejected"
          ? "#ef4444"
          : "#f59e0b");

    // Extract attachment name from URL if available
    const attachmentName = log.attachmentUrl
      ? log.attachmentUrl.split("/").pop()?.split("?")[0]
      : undefined;

    // Only show description for progress_update logs, not for other log types
    const showDescription = log.logType === "progress_update";

    return {
      title,
      timestamp: formatApiDate(effectiveTimestamp), // Use effectiveTimestamp for display
      effectiveTimestamp, // Store for sorting
      statusText: finalStatusText,
      statusColor: finalStatusColor,
      accentColor: detailsType === "revision" ? "#f59e0b" : "#3b82f6",
      description: showDescription ? (details ?? null) : undefined,
      details: showDescription ? (details ?? null) : null,
      detailsType,
      attachmentUrl: log.attachmentUrl,
      attachmentName,
      revisions: log.revisions || [],
      logId: log.id, // Add logId for matching with revisions
      logType: log.logType, // Add logType for identifying progress updates
    };
  });

  // Filter out null entries
  const filteredItems = items.filter((item): item is NonNullable<typeof item> => item !== null);
  
  // Sort by effectiveTimestamp descending (newest first)
  return filteredItems.sort((a, b) => {
    const dateA = new Date(a.effectiveTimestamp).getTime();
    const dateB = new Date(b.effectiveTimestamp).getTime();
    return dateB - dateA;
  });
};

/**
 * Transform break requests to timeline items
 * Uses createdAt as effectiveTimestamp for proper sorting
 */
const transformBreakRequestsToItems = (
  breakRequests: GetJobLogsResponse["breakRequests"],
) => {
  return breakRequests.map((br) => ({
    title: `${br.type === "short_term" ? "Short Term" : "Long Term"} Break`,
    timestamp: formatApiDate(br.createdAt),
    effectiveTimestamp: br.createdAt,
    statusText: br.status.charAt(0).toUpperCase() + br.status.slice(1),
    statusColor:
      br.status === "approved"
        ? "#22c55e"
        : br.status === "rejected"
          ? "#ef4444"
          : "#f59e0b",
    accentColor: "#8b5cf6",
    details: br.reason,
    startDate: br.startAt,
    endDate: br.endAt,
    approverComment: br.approverComment || undefined,
  }));
};

/**
 * Transform sign-off sheets to timeline items
 */
const transformSignOffsToItems = (
  signOffs: GetJobLogsResponse["signOffSheets"],
) => {
  if (!signOffs) return [];
  return signOffs.map((so) => {
    // Build attachments array from attachmentUrl and signatureAttachmentUrl if available
    const attachments: Array<{ name: string; url: string }> = [];
    
    if (so.attachmentUrl) {
      attachments.push({
        name: so.attachmentUrl.split("/").pop()?.split("?")[0] || "Work Attachment",
        url: so.attachmentUrl,
      });
    }
    
    if (so.signatureAttachmentUrl) {
      attachments.push({
        name: so.signatureAttachmentUrl.split("/").pop()?.split("?")[0] || "Signature Attachment",
        url: so.signatureAttachmentUrl,
      });
    }

    return {
      title: "Final Statement",
      timestamp: formatApiDate(so.createdAt),
      effectiveTimestamp: so.createdAt,
      statusText: so.status.charAt(0).toUpperCase() + so.status.slice(1),
      statusColor:
        so.status === "approved"
          ? "#22c55e"
          : so.status === "rejected"
            ? "#ef4444"
            : "#f59e0b",
      accentColor: "#10b981",
      details: so.details,
      attachments: attachments.length > 0 ? attachments : undefined,
    };
  });
};

/**
 * Transform engineer's job/proposal data to timeline items
 */
const transformProposalToTimelineItems = (
  jobs: EngineerGetMyJobsResponse,
  currentJobId?: number,
) => {
  if (!jobs || jobs.length === 0) return [];

  // Filter to current job if provided, otherwise get all proposals
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
          details: "",
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
          details: "",
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
          details: "",
          sortOrder: 100,
        });
      }
    }

    // 3. Proposal Accepted entry (if accepted/assigned or later statuses)
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

    // 2. Proposal Submitted entry (if applied)
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
        allItems.push({
          title: "Proposal Submitted",
          timestamp: formatApiDate(submittedTimestamp),
          statusText: "",
          statusColor: "#f59e0b",
          accentColor: "#3b82f6",
          details: "",
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
        details: "",
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

  // Fetch job logs from real API
  const { data: jobLogs, isLoading: isLoadingLogs } = useGetJobLogs(
    assignmentId ?? 0,
    !!assignmentId,
  );

  // Fetch engineer's jobs to get proposal status
  const { data: engineerJobs } = useEngineerGetMyJobs(!!jobId || !!hasApplied);

  // Transform proposal data to timeline items
  const proposalTimelineItems = useMemo(() => {
    if (
      !engineerJobs ||
      !Array.isArray(engineerJobs) ||
      engineerJobs.length === 0
    )
      return [];
    return transformProposalToTimelineItems(engineerJobs, jobId);
  }, [engineerJobs, jobId]);

  // Transform API data to timeline items
  const apiTimelineItems = useMemo(() => {
    if (!jobLogs) return [];

    const logItems = transformLogsToTimelineItems(jobLogs.logs || []);
    const breakItems = transformBreakRequestsToItems(
      jobLogs.breakRequests || [],
    );
    const signOffItems = transformSignOffsToItems(jobLogs.signOffSheets || []);

    const allItems = [...logItems, ...breakItems, ...signOffItems];
    // Sort by effectiveTimestamp descending (newest first)
    return allItems.sort((a, b) => {
      const dateA = a.effectiveTimestamp ? new Date(a.effectiveTimestamp).getTime() : 0;
      const dateB = b.effectiveTimestamp ? new Date(b.effectiveTimestamp).getTime() : 0;
      return dateB - dateA;
    });
  }, [jobLogs]);

  // Extract revision updates from jobLogs for TimelineSectionHeader
  const apiRevisionUpdateDataList = useMemo(() => {
    if (!jobLogs?.logs?.length) return [];

    const revisionDataList: any[] = [];

    // Find all progress update logs that have revisions
    for (const log of jobLogs.logs) {
      if ((log.logType === "progress_update" || log.logType === "SUBMISSION") && 
          log.revisions && log.revisions.length > 0) {
        
        const revisions = log.revisions.map((rev) => ({
          revisionId: rev.revisionId,
          logId: log.id,
          content: rev.content,
          attachmentUrl: rev.attachmentUrl,
          clientComment: rev.clientComment,
          clientAttachmentUrl: rev.clientAttachmentUrl,
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
        });
      }
    }

    return revisionDataList;
  }, [jobLogs]);

  // Build timeline items - combines API logs with proposal data
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
    // Sort by effectiveTimestamp descending (newest first)
    return allItems.sort((a, b) => {
      const dateA = a.effectiveTimestamp ? new Date(a.effectiveTimestamp).getTime() : new Date(a.timestamp).getTime();
      const dateB = b.effectiveTimestamp ? new Date(b.effectiveTimestamp).getTime() : new Date(b.timestamp).getTime();
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
      {/* Action Required - Show ONLY progress updates requiring engineer action (revision_requested or pending) */}
      {progressUpdates.length > 0 && (
        <div className="space-y-3 mb-4">
          {/* Calculate action required count once */}
          {(() => {
            const actionRequiredUpdates = progressUpdates.filter((update) => {
              if (update.title !== "Progress Update") return false;
              const statusLower = String(update.statusText || "").toLowerCase();
              return statusLower === "pending" || statusLower === "revision requested" || statusLower === "revision_requested";
            });
            const actionRequiredCount = actionRequiredUpdates.length;
            
            return actionRequiredCount > 0 ? (
              <>
                <ActionRequiredBadge count={actionRequiredCount} />
                {actionRequiredUpdates.map((update, idx) => {
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
              </>
            ) : null;
          })()}
        </div>
      )}

      {/* Activity Timeline - Show ALL items using TimelineSectionHeader for expandable revision conversations */}
      {timelineItems.length > 0 && (
        <TimelineSectionHeader 
          items={timelineItems.map(item => ({
            ...item,
            logId: item.logId,
            logType: item.logType || "progress_update"
          }))}
          apiRevisionUpdateDataList={apiRevisionUpdateDataList}
        />
      )}

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
          assignmentId={assignmentId}
          // API returns jobLogId in revisions, not logId - check both for compatibility
          logId={activeRevision?.revisions?.[0]?.jobLogId ?? activeRevision?.revisions?.[0]?.logId ?? activeRevision?.logId}
          revisionId={activeRevision?.revisions?.[0]?.revisionId}
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

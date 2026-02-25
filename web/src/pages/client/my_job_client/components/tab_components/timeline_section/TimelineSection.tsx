import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { HiCheckCircle, HiChevronDown } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  formatApiDate,
  transformLogsToTimelineItems,
} from "@/utils/timelineUtils";
// import TimelineList from "@/shared/components/TimelineList";
import type {
  CardButtonType,
  TimelineRevisionData,
} from "@/pages/client/my_job_client/types";
import type { RevisionData } from "./TimelineSectionHeader";
import {} from // createRevisionUpdateCardData,
"@/dummy_data/clientTimelineDummyData";
import {
  TIMELINE_STATUS,
  TIMELINE_CARD_COLORS,
  MODAL_TITLES,
  MODAL_MESSAGES,
  TOAST_MESSAGES,
  // jobStartedCardData,
} from "@/constants/timelineConstants";
import type { TimelineStatus } from "@/constants/timelineConstants";
import ProgressUpdateCard from "./ProgressUpdateCard";
import ShortBreakCard from "./ShortBreakCard";
import FinalStatementCard from "./FinalStatementCard";
import JobStartedCard from "./JobStartedCard";
import RevisionFormModal from "./RevisionFormModal";
import ConfirmModal from "./ConfirmModal";
import ShortBreakApprovalModal from "./ShortBreakApprovalModal";
import ActionRequiredBadge from "./ActionRequiredBadge";
import TimelineSectionHeader from "./TimelineSectionHeader";
import TimelineToggleButton from "../TimelineToggleButton";
import GiveFeedbackButton from "@/shared/components/commonUI/GiveFeedbackButton";
import type {
  RevisionFormData,
  RevisionRequestDetails,
} from "./clientTimelineTypes";
import {
  useGetJobLogs,
  useClientGetAssignmentDetails,
  useClientActionOnAssignment,
  useClientActionOnWorkLog,
  useClientActionOnBreak,
} from "@/shared/apiServices/client/clientOpenApiService";
// import type { GetJobLogsResponse } from "@/api";

const FormMode = {
  Revision: "revision",
  RevisionUpdate: "revisionUpdate",
} as const;

type FormMode = (typeof FormMode)[keyof typeof FormMode];

/**
 * Client timeline tab for progress, revisions, short breaks, final statements, and job approvals.
 * Uses real API data from /jobs/assignments/{assignmentId}/logs endpoint when available.
 * Also uses /jobs/assignment-details to get proposal statuses.
 * Falls back to dummy data when API is not available.
 * Collapsible cards with status chips/timestamps track each step.
 * Modal + confirm flows collect revision inputs and short-break notes.
 * Toasts provide immediate feedback on approve/reject/revision actions.
 * When hasProposals is true and no API logs available, shows local "Proposal Received" entry.
 */
const TimelineSection: React.FC<{
  assignmentId?: number;
  jobId?: number;
  hasProposals?: boolean;
}> = ({ assignmentId, jobId, hasProposals = false }) => {
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false);
  const [isShortBreakCollapsed, setIsShortBreakCollapsed] = useState(false);
  const [isFinalStatementCollapsed, setIsFinalStatementCollapsed] =
    useState(false);
  const [isJobCollapsed, setIsJobCollapsed] = useState(false);
  const initialStatus: TimelineStatus = TIMELINE_STATUS.pending;
  const [jobStatus, setJobStatus] = useState<TimelineStatus>(initialStatus);
  const [progressStatus, setProgressStatus] =
    useState<TimelineStatus>(initialStatus);
  const [revisionUpdateStatus, setRevisionUpdateStatus] =
    useState<TimelineStatus>(initialStatus);
  const [shortBreakStatuses, setShortBreakStatuses] = useState<
    Record<number, TimelineStatus>
  >({});
  const [finalStatementStatus, setFinalStatementStatus] =
    useState<TimelineStatus>(initialStatus);
  const [
    showFinalStatementApproveConfirm,
    setShowFinalStatementApproveConfirm,
  ] = useState(false);
  const [showFinalStatementRejectConfirm, setShowFinalStatementRejectConfirm] =
    useState(false);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFormConfirm, setShowFormConfirm] = useState(false);
  const [currentRevisionLogId, setCurrentRevisionLogId] = useState<
    number | undefined
  >(undefined);
  const [currentRevisionId, setCurrentRevisionId] = useState<
    number | undefined
  >(undefined);
  const [showShortBreakApprovalModal, setShowShortBreakApprovalModal] =
    useState(false);
  const [currentBreakRequestId, setCurrentBreakRequestId] = useState<
    number | null
  >(null);
  const [showJobApproveConfirm, setShowJobApproveConfirm] = useState(false);
  const [showJobRejectConfirm, setShowJobRejectConfirm] = useState(false);
  const [shortBreakNotes, setShortBreakNotes] = useState("");
  const [keepProgressExpanded, setKeepProgressExpanded] = useState(false);
  const [revisionRequestDetails, setRevisionRequestDetails] =
    useState<RevisionRequestDetails | null>(null);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  const [isRevisionUpdateCollapsed, setIsRevisionUpdateCollapsed] =
    useState(false);

  const revisionFormMethods = useForm<RevisionFormData>({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      notes: "",
      attachment: undefined,
    },
  });

  // Fetch job logs from real API
  const { data: jobLogs, isLoading: isLoadingLogs } = useGetJobLogs(
    assignmentId ?? 0,
    !!assignmentId,
  );

  // Fetch assignment details - pass both jobId and assignmentId to API
  // API accepts both parameters, so we can use either one or both
  // Ensure jobId is valid (not NaN) before passing
  const validJobId = jobId && !isNaN(jobId) ? jobId : undefined;
  const { data: assignmentDetails } = useClientGetAssignmentDetails(
    { jobId: validJobId, assignmentId },
    !!(validJobId || assignmentId),
  );

  // Mutation for client action on assignment (approve/reject start job and final statement)
  const { mutate: actionOnAssignment } = useClientActionOnAssignment({
    onSuccess: () => {
      // Query invalidation will refresh the data - no need to reload page
    },
    onError: (error) => {
      console.error("Assignment action failed:", error);
      toast.error("Failed to process request. Please try again.", {
        position: "top-right",
      });
    },
  });

  // Mutation for client action on work log (approve/reject/request revision)
  const { mutate: actionOnWorkLog } = useClientActionOnWorkLog({
    onSuccess: () => {
      // The query will be automatically invalidated due to the mutation configuration
    },
    onError: (error) => {
      console.error("Work log action failed:", error);
      toast.error("Failed to process work log action. Please try again.", {
        position: "top-right",
      });
    },
  });

  // Mutation for client action on break request (approve/reject)
  const { mutate: actionOnBreak } = useClientActionOnBreak({
    onSuccess: () => {},
    onError: (error) => {
      console.error("Break request action failed:", error);
      toast.error("Failed to process break request action. Please try again.", {
        position: "top-right",
      });
    },
  });

  // Initialize status from API data when jobLogs changes
  useEffect(() => {
    if (!jobLogs?.logs?.length) return;

    // Check progress log status
    const progressLog = jobLogs.logs.find(
      (log) =>
        log.logType === "progress_update" || log.logType === "SUBMISSION",
    );

    if (progressLog) {
      if (progressLog.status === "approved") {
        setProgressStatus(TIMELINE_STATUS.approved);
      } else if (progressLog.status === "rejected") {
        setProgressStatus(TIMELINE_STATUS.rejected);
      } else if (progressLog.status === "revision_requested") {
        setProgressStatus(TIMELINE_STATUS.revision);
      }

      // Check if there are any revisions with approved/rejected status
      if (progressLog.revisions && progressLog.revisions.length > 0) {
        const latestRevision = progressLog.revisions[0];
        if (latestRevision.status === "approved") {
          setRevisionUpdateStatus(TIMELINE_STATUS.approved);
        } else if (latestRevision.status === "rejected") {
          setRevisionUpdateStatus(TIMELINE_STATUS.rejected);
        }
      }
    }

    // Check break request status
    if (jobLogs.breakRequests && jobLogs.breakRequests.length > 0) {
      const newBreakStatuses: Record<number, TimelineStatus> = {};
      jobLogs.breakRequests.forEach((breakRequest) => {
        if (breakRequest.status === "approved") {
          newBreakStatuses[breakRequest.id] = TIMELINE_STATUS.approved;
        } else if (breakRequest.status === "rejected") {
          newBreakStatuses[breakRequest.id] = TIMELINE_STATUS.rejected;
        } else if (breakRequest.status === "pending") {
          newBreakStatuses[breakRequest.id] = TIMELINE_STATUS.pending;
        }
      });
      setShortBreakStatuses(newBreakStatuses);
    }

    // Check final statement (sign-off sheet) status
    if (jobLogs.signOffSheets && jobLogs.signOffSheets.length > 0) {
      const signOff = jobLogs.signOffSheets[0];
      if (signOff.status === "approved") {
        setFinalStatementStatus(TIMELINE_STATUS.approved);
      } else if (signOff.status === "rejected") {
        setFinalStatementStatus(TIMELINE_STATUS.rejected);
      } else if (signOff.status === "pending") {
        setFinalStatementStatus(TIMELINE_STATUS.pending);
      }
    }
  }, [jobLogs]);

  // Transform assignment details to proposal timeline items
  // Shows ALL proposal status changes as history (not just current status)
  // Sorted by order (most recent events first)
  const proposalTimelineItems = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) {
      return [];
    }

    const allItems: Array<{
      title: string;
      timestamp: string;
      statusText: string;
      statusColor: string;
      accentColor: string;
      details: string;
      sortOrder: number;
    }> = [];

    assignmentDetails.forEach((assignment) => {
      const status = assignment.assignmentStatus?.toLowerCase();
      const appliedDate =
        formatApiDate(assignment.appliedAt) ||
        formatApiDate(assignment.invitedAt) ||
        formatDateTime();

      // Add entries in reverse chronological order (most recent first) based on current status

      // Add "Work Submitted" if status is submitted (most recent)
      if (status === "submitted") {
        allItems.push({
          title: "Work Submitted",
          timestamp: appliedDate,
          statusText: "Submitted",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: "",
          sortOrder: 100,
        });
      }

      // Add "Job Started" if status is started, or submitted
      if (status === "started" || status === "submitted") {
        allItems.push({
          title: "Job Started",
          timestamp: appliedDate,
          statusText: "Approved",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: "",
          sortOrder: status === "submitted" ? 90 : 100,
        });
      }

      // Add "Proposal Accepted" if status is accepted, assigned, start_pending_approval, started, or submitted
      if (
        status === "accepted" ||
        status === "assigned" ||
        status === "start_pending_approval" ||
        status === "started" ||
        status === "submitted" ||
        status === "submit_pending_approval"
      ) {
        allItems.push({
          title: "Proposal Accepted",
          timestamp: appliedDate,
          statusText: "Approved",
          statusColor: "#22c55e",
          accentColor: "#22c55e",
          details: "",
          sortOrder: 50,
        });
      }

      // Always add "Proposal Received" entry (oldest)
      allItems.push({
        title: "Proposal Received",
        timestamp: appliedDate,
        statusText: "Received",
        statusColor: "#3b82f6",
        accentColor: "#3b82f6",
        sortOrder: 0,
        details: "",
      });

      // Add "Proposal Rejected" if status is rejected
      if (status === "rejected") {
        allItems.push({
          title: "Proposal Rejected",
          timestamp: appliedDate,
          statusText: "Rejected",
          statusColor: "#ef4444",
          accentColor: "#ef4444",
          details: "",
          sortOrder: 100,
        });
      }
    });

    // Sort by sortOrder descending (highest first = most recent first)
    allItems.sort((a, b) => b.sortOrder - a.sortOrder);
    return allItems;
  }, [assignmentDetails]);

  // Transform API data to card data - returns array of all progress updates
  const apiProgressDataList = useMemo(() => {
    if (!jobLogs?.logs?.length) return [];

    // Find ALL progress update logs (supports "progress_update" and "SUBMISSION" types)
    const progressLogs = jobLogs.logs.filter(
      (log) =>
        log.logType === "progress_update" || log.logType === "SUBMISSION",
    );

    if (progressLogs.length === 0) return [];

    // Transform each progress log to card data
    return progressLogs.map((progressLog) => {
      // Build attachments array from attachmentUrl if available
      const attachments = progressLog.attachmentUrl
        ? [
            {
              name:
                progressLog.attachmentUrl.split("/").pop()?.split("?")[0] ||
                "Attachment",
              url: progressLog.attachmentUrl,
            },
          ]
        : undefined;

      // Generate proper title based on logType and status
      let title = progressLog.title || "Progress Update";
      if (progressLog.logType === "SUBMISSION") {
        if ((progressLog.status as string) === "pending") {
          title = "Proposal Submitted";
        } else if (progressLog.status === "approved") {
          title = "Proposal Accepted";
        } else if (progressLog.status === "rejected") {
          title = "Proposal Rejected";
        }
      } else if (progressLog.logType === "JOB_POSTED") {
        title = "Job Posted";
      } else if (progressLog.logType === "JOB_STARTED") {
        title = "Job Started";
      } else if (progressLog.logType === "JOB_COMPLETED") {
        title = "Job Completed";
      } else if (progressLog.status === "revision_requested") {
        // Use the title from the log if available, otherwise show default
        title = progressLog.title || "Revision Requested";
      }

      return {
        id: `progress-${progressLog.id}`,
        logId: progressLog.id,
        type: "progressUpdate" as const,
        title,
        description: progressLog.details || "",
        timestamp: formatApiDate(progressLog.timestamp),
        attachments,
        accentColor: TIMELINE_CARD_COLORS.green,
        buttons: [
          ...(["approve", "reject", "requestRevision"] as CardButtonType[]),
        ],
        // Include the raw log for revision extraction
        rawLog: progressLog,
      };
    });
  }, [jobLogs]);

  // Get the first progress data for backward compatibility
  const apiProgressData =
    apiProgressDataList.length > 0 ? apiProgressDataList[0] : null;

  // Extract revision updates for EACH progress log - returns array of revision data
  const apiRevisionUpdateDataList = useMemo((): RevisionData[] => {
    if (!jobLogs?.logs?.length) return [];

    const revisionDataList: RevisionData[] = [];

    // Find all progress update logs that have revisions
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
          attachmentUrl: rev.attachmentUrl,
          clientComment: rev.clientComment,
          clientAttachmentUrl: rev.clientAttachmentUrl,
          createdAt: rev.createdAt,
          updatedAt: rev.updatedAt,
          status: rev.status,
        }));

        revisionDataList.push({
          logId: log.id,
          revisionId: revisions[0]?.revisionId || 0,
          content: revisions[0]?.content || null,
          attachmentUrl: revisions[0]?.attachmentUrl || null,
          status: revisions[0]?.status || "pending",
          revisions: revisions,
        });
      }
    }

    return revisionDataList;
  }, [jobLogs]);

  // Get first revision data for backward compatibility
  const apiRevisionUpdateData =
    apiRevisionUpdateDataList.length > 0 ? apiRevisionUpdateDataList[0] : null;

  // Extract revision request data from API logs
  const apiRevisionRequestData = useMemo(() => {
    if (!jobLogs?.logs?.length) return null;

    // Find logs with revision_requested status
    const revisionRequestedLogs = jobLogs.logs.filter(
      (log) => log.status === "revision_requested",
    );

    if (revisionRequestedLogs.length === 0) return null;

    // Get the most recent one
    const latestLog = revisionRequestedLogs[0];

    // Check if there's a revision from engineer
    const latestRevision = latestLog.revisions?.[0];

    return {
      id: `revision-request-${latestLog.id}`,
      logId: latestLog.id,
      revisionId: latestRevision?.revisionId,
      type: "revisionRequestUpdate" as const,
      title: "Revision Request",
      description: latestRevision?.content || latestLog.details || "",
      timestamp: formatApiDate(
        latestRevision?.createdAt || latestLog.timestamp,
      ),
      attachments: latestRevision?.attachmentUrl
        ? [
            {
              name:
                latestRevision.attachmentUrl.split("/").pop()?.split("?")[0] ||
                "Attachment",
              url: latestRevision.attachmentUrl,
            },
          ]
        : undefined,
      accentColor: TIMELINE_CARD_COLORS.orange,
      buttons: ["reject", "requestRevision", "approve"] as CardButtonType[],
    };
  }, [jobLogs]);

  const apiBreakRequestsData = useMemo(() => {
    if (!jobLogs?.breakRequests?.length) return [];

    // Map all break requests to card data
    return jobLogs.breakRequests.map((breakRequest) => {
      // Determine accent color based on status
      const accentColor =
        breakRequest.status === "approved"
          ? TIMELINE_CARD_COLORS.green
          : breakRequest.status === "rejected"
            ? TIMELINE_CARD_COLORS.red
            : TIMELINE_CARD_COLORS.orange;

      return {
        id: `break-${breakRequest.id}`,
        requestId: breakRequest.id, // Actual ID for API calls
        type: "shortTermBreak" as const,
        title: `${breakRequest.type === "short_term" ? "Short Term" : "Long Term"} Break`,
        description: breakRequest.reason || "",
        timestamp: formatApiDate(breakRequest.createdAt),
        rawTimestamp: breakRequest.createdAt, // Raw ISO timestamp for sorting
        startDate: breakRequest.startAt,
        endDate: breakRequest.endAt,
        accentColor,
        buttons: ["reject", "approve"] as CardButtonType[],
        status: breakRequest.status,
        approverComment: breakRequest.approverComment || null,
      };
    });
  }, [jobLogs]);

  const apiFinalStatementData = useMemo(() => {
    if (!jobLogs?.signOffSheets?.length) return null;

    // Find the latest sign-off sheet
    const signOff = jobLogs.signOffSheets[0];

    // Build attachments array from attachmentUrl and signatureAttachmentUrl if available
    const attachments: Array<{ name: string; url: string }> = [];

    if (signOff.attachmentUrl) {
      attachments.push({
        name:
          signOff.attachmentUrl.split("/").pop()?.split("?")[0] ||
          "Work Attachment",
        url: signOff.attachmentUrl,
      });
    }

    if (signOff.signatureAttachmentUrl) {
      attachments.push({
        name:
          signOff.signatureAttachmentUrl.split("/").pop()?.split("?")[0] ||
          "Signature Attachment",
        url: signOff.signatureAttachmentUrl,
      });
    }

    return {
      id: `final-statement-${signOff.id}`,
      type: "finalStatement" as const,
      title: "Final Statement",
      description: signOff.details || "",
      timestamp: formatApiDate(signOff.createdAt),
      rawTimestamp: signOff.createdAt, // Raw ISO timestamp for sorting
      accentColor: TIMELINE_CARD_COLORS.green,
      buttons: ["reject", "approve"] as CardButtonType[],
      attachments: attachments.length > 0 ? attachments : undefined,
      status: signOff.status, // Add status for filtering
    };
  }, [jobLogs]);

  // Transform API data to timeline items
  const apiTimelineItems = useMemo(() => {
    if (!jobLogs) return [];

    const logItems = transformLogsToTimelineItems(jobLogs.logs || []);
    // Filter out items with invalid dates, then sort by timestamp descending (newest first)
    return logItems
      .filter((item) => {
        const time = item.effectiveTimestamp || item.timestamp;
        if (!time) return false;
        const date = new Date(time).getTime();
        return !isNaN(date);
      })
      .sort((a, b) => {
        const timeA = a.effectiveTimestamp || a.timestamp;
        const timeB = b.effectiveTimestamp || b.timestamp;
        const dateA = new Date(timeA!).getTime();
        const dateB = new Date(timeB!).getTime();
        return dateB - dateA;
      });
  }, [jobLogs]);

  // Get job started data from API logs
  const apiJobStartedData = useMemo(() => {
    if (!jobLogs?.logs?.length) return null;

    const jobStartedLog = jobLogs.logs.find(
      (log) => log.logType === "JOB_STARTED",
    );

    if (!jobStartedLog) return null;

    return {
      id: `job-started-${jobStartedLog.id}`,
      type: "jobStarted" as const,
      title: "Job Started",
      description:
        jobStartedLog.details || "Engineer has started working on the job",
      timestamp: formatApiDate(jobStartedLog.timestamp),
      rawTimestamp: jobStartedLog.timestamp, // Add raw timestamp for sorting
      accentColor: TIMELINE_CARD_COLORS.green,
      buttons: ["reject", "approve"] as CardButtonType[],
    };
  }, [jobLogs]);

  // Prepare action required progress update cards - filters and computes card data
  const actionRequiredProgressCards = useMemo(() => {
    if (!apiProgressDataList?.length) return [];

    return apiProgressDataList
      .filter((progressData) => {
        const thisLogStatus = String(
          (progressData.rawLog as { status?: string })?.status,
        ).toLowerCase();
        return (
          thisLogStatus === "pending" || thisLogStatus === "revision_requested"
        );
      })
      .map((progressData) => {
        // Find the revision data for this specific progress log
        const revisionData = apiRevisionUpdateDataList.find(
          (r) => r.logId === progressData.logId,
        );

        // Get this specific log's status
        const thisLogStatus = (progressData.rawLog as { status?: string })
          ?.status;
        const thisLogIsPending =
          String(thisLogStatus).toLowerCase() === "pending";

        // Check if the revision itself is pending
        const latestRevision = revisionData?.revisions?.[0];
        const revisionStatus = latestRevision?.status;
        const revisionIsPending =
          String(revisionStatus).toLowerCase() === "pending";

        // Use TIMELINE_STATUS.approved for non-pending logs to hide action buttons
        const thisLogProgressStatus = thisLogIsPending
          ? progressStatus
          : TIMELINE_STATUS.approved;

        // Determine revisionUpdateStatus based on the revision's status
        const thisLogRevisionUpdateStatus = revisionIsPending
          ? revisionUpdateStatus
          : TIMELINE_STATUS.approved;

        // Only show action buttons on PENDING progress logs
        const cardData = thisLogIsPending
          ? progressData
          : {
              ...progressData,
              buttons: [],
            };

        return {
          progressData,
          revisionData,
          thisLogStatus,
          thisLogIsPending,
          thisLogProgressStatus,
          thisLogRevisionUpdateStatus,
          cardData,
        };
      });
  }, [
    apiProgressDataList,
    apiRevisionUpdateDataList,
    progressStatus,
    revisionUpdateStatus,
  ]);

  // Build timeline items - combines API data with proposal items
  // Uses effectiveTimestamp for proper sorting
  // Shows each type of item only once
  const timelineItems = useMemo(() => {
    type TimelineItem = {
      title: string;
      timestamp: string;
      effectiveTimestamp?: string;
      statusText: string;
      statusColor: string;
      accentColor: string;
      details: string | null;
      sortOrder: number;
      itemType?: string; // For deduplication
      approverComment?: string | null;
    };

    // Use a Map to ensure uniqueness by title (key = title)
    const itemsMap = new Map<string, TimelineItem>();

    // Add proposal items from assignment details API - use title as unique key
    if (proposalTimelineItems.length > 0) {
      // Sort proposal items first (by sortOrder) to get them in order
      const sortedProposals = [...proposalTimelineItems].sort(
        (a, b) => b.sortOrder - a.sortOrder,
      );

      sortedProposals.forEach((item) => {
        // Use title as unique key - will keep first occurrence only
        if (!itemsMap.has(item.title)) {
          itemsMap.set(item.title, {
            ...item,
            effectiveTimestamp: item.timestamp,
            itemType: item.title,
          });
        }
      });
    }

    // Add API logs - only APPROVED progress updates with revisions
    // Use logId as unique key to avoid duplicates
    if (apiTimelineItems.length > 0) {
      apiTimelineItems.forEach((item) => {
        const uniqueKey = `progress-${item.logId}`;

        // Only add if not already present
        if (!itemsMap.has(uniqueKey)) {
          itemsMap.set(uniqueKey, {
            ...item,
            sortOrder: 0, // Use date-based sorting, not sortOrder
            itemType: uniqueKey,
          });
        }
      });
    }

    // Add break requests to timeline - only APPROVED/REJECTED ones go to Activity Timeline
    // Pending ones stay in Action Required
    if (apiBreakRequestsData.length > 0) {
      apiBreakRequestsData.forEach((breakReq) => {
        // Only add approved/rejected break requests to Activity Timeline
        if (breakReq.status === "approved" || breakReq.status === "rejected") {
          const uniqueKey = `break-${breakReq.requestId}`;
          if (!itemsMap.has(uniqueKey)) {
            itemsMap.set(uniqueKey, {
              title: breakReq.title,
              timestamp: breakReq.timestamp,
              effectiveTimestamp: breakReq.rawTimestamp || breakReq.timestamp, // Use raw timestamp for sorting, fallback to formatted
              statusText:
                breakReq.status.charAt(0).toUpperCase() +
                breakReq.status.slice(1),
              statusColor:
                breakReq.status === "approved" ? "#22c55e" : "#ef4444",
              accentColor: breakReq.accentColor,
              details: breakReq.description,
              sortOrder: 0, // Use date-based sorting
              itemType: uniqueKey,
              approverComment: breakReq.approverComment,
            });
          }
        }
      });
    }

    // Add final statements to timeline - only APPROVED/REJECTED ones go to Activity Timeline
    // Pending ones stay in Action Required
    if (
      apiFinalStatementData &&
      (apiFinalStatementData.status === "approved" ||
        apiFinalStatementData.status === "rejected")
    ) {
      const uniqueKey = `final-statement-${apiFinalStatementData.id}`;
      if (!itemsMap.has(uniqueKey)) {
        itemsMap.set(uniqueKey, {
          title: apiFinalStatementData.title,
          timestamp: apiFinalStatementData.timestamp,
          effectiveTimestamp:
            apiFinalStatementData.rawTimestamp ||
            apiFinalStatementData.timestamp, // Use raw timestamp for sorting, fallback to formatted
          statusText:
            apiFinalStatementData.status.charAt(0).toUpperCase() +
            apiFinalStatementData.status.slice(1),
          statusColor:
            apiFinalStatementData.status === "approved" ? "#22c55e" : "#ef4444",
          accentColor: apiFinalStatementData.accentColor,
          details: apiFinalStatementData.description,
          sortOrder: 0, // Use date-based sorting
          itemType: uniqueKey,
        });
      }
    }

    // Add "Proposal Received" fallback when hasProposals is true and no proposal items
    if (
      hasProposals &&
      proposalTimelineItems.length === 0 &&
      apiTimelineItems.length === 0 &&
      !itemsMap.has("Proposal Received")
    ) {
      itemsMap.set("Proposal Received", {
        title: "Proposal Received",
        timestamp: formatDateTime(),
        effectiveTimestamp: formatDateTime(),
        statusText: "Pending",
        statusColor: "#f59e0b",
        accentColor: "#3b82f6",
        details: "Proposals received. Manage them in the Manage Proposals tab.",
        sortOrder: 0,
        itemType: "Proposal Received",
      });
    }

    // Convert Map to array and sort by effectiveTimestamp descending (latest first)
    const allItems = Array.from(itemsMap.values());
    return allItems.sort((a, b) => {
      const timeA = a.effectiveTimestamp || a.timestamp;
      const timeB = b.effectiveTimestamp || b.timestamp;
      // Parse dates explicitly to handle ISO format correctly
      const dateA = timeA ? new Date(timeA).getTime() : 0;
      const dateB = timeB ? new Date(timeB).getTime() : 0;
      // If dates are invalid, use 0
      const validDateA = isNaN(dateA) ? 0 : dateA;
      const validDateB = isNaN(dateB) ? 0 : dateB;
      return validDateB - validDateA;
    });
  }, [
    apiTimelineItems,
    proposalTimelineItems,
    hasProposals,
    apiBreakRequestsData,
    apiFinalStatementData,
  ]);

  // Determine card visibility based on API data - only show cards when API has data
  const hasProgressData = apiProgressDataList.length > 0;
  const hasBreakData = apiBreakRequestsData.length > 0;
  const hasFinalStatementData = apiFinalStatementData !== null;

  // Check if there's a pending start request (start_pending_approval status)
  const hasPendingStartRequest = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    return assignmentDetails.some(
      (a) => a.assignmentStatus === "start_pending_approval",
    );
  }, [assignmentDetails]);

  // Determine if there's job started API data
  const hasJobStartedData = apiJobStartedData !== null;

  // Check if there are any API timeline items (job logs)
  const hasApiTimelineItems = apiTimelineItems.length > 0;

  // Determine card data for JobStartedCard based on status
  const jobStartedCard = useMemo(() => {
    // Use API data if available
    if (apiJobStartedData) {
      return apiJobStartedData;
    }
    // Use pending start request data if available (from assignment API)
    if (hasPendingStartRequest) {
      // Use current timestamp since API doesn't provide specific timestamp for start_pending_approval
      const timestamp = new Date().toISOString();
      return {
        id: "job-started-pending",
        type: "jobStarted" as const,
        title: "Job Started",
        description:
          "Engineer has requested to start the job. Please review and approve.",
        timestamp: formatApiDate(timestamp),
        accentColor: TIMELINE_CARD_COLORS.green,
        buttons: ["reject", "approve"] as CardButtonType[],
      };
    }
    // No data available - return null
    return null;
  }, [apiJobStartedData, hasPendingStartRequest]);

  // Show JobStartedCard when there's job started API data OR pending start request
  const showJobStartedCard = hasJobStartedData || hasPendingStartRequest;

  // Get engineer data from assignment details for feedback feature
  const engineerData = useMemo(() => {
    // Return null if no assignment details
    if (!assignmentDetails || assignmentDetails.length === 0) return null;

    // Get the first assignment
    const assignment = assignmentDetails[0];

    // Show engineer card when there's an assigned engineer (proposal accepted) or the job is in progress
    // This includes all states from invited through submitted (including final statement pending)
    const status = assignment.assignmentStatus?.toLowerCase();
    const isValidStatus =
      status === "accepted" ||
      status === "assigned" ||
      status === "started" ||
      status === "submitted" ||
      status === "start_pending_approval" ||
      status === "submit_pending_approval" ||
      status === "invited" ||
      status === "applied";

    if (!isValidStatus || !assignment?.engineer) {
      return null;
    }

    // Get role from skills if available
    const role = assignment.engineer.skills?.[0] || "Engineer";

    return {
      id: assignment.engineer.id,
      name: assignment.engineer.name,
      email: assignment.engineer.email,
      role: role,
      assignmentId: assignment.assignmentId,
    };
  }, [assignmentDetails]);

  // Check if there's a pending proposal or start request
  const hasPendingProposal = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    const status = assignmentDetails[0].assignmentStatus?.toLowerCase();
    // Only show pending proposal for actual pending states, not for submitted/started (which means work is in progress)
    return (
      status === "invited" ||
      status === "applied" ||
      status === "start_pending_approval"
    );
  }, [assignmentDetails]);

  // Check if work is completed (final statement approved OR job status is completed)
  const isJobCompleted = useMemo(() => {
    // Check if final statement is approved
    if (finalStatementStatus === TIMELINE_STATUS.approved) {
      return true;
    }
    // Check if job status is Closed
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    const hasClosedJob = assignmentDetails.some(
      (a) => a.jobStatus === "Closed",
    );
    return hasClosedJob;
  }, [finalStatementStatus, assignmentDetails]);

  // Show feedback when job is completed
  const isWorkCompleted = isJobCompleted;

  const accentColor =
    jobStatus === TIMELINE_STATUS.rejected
      ? TIMELINE_CARD_COLORS.red
      : TIMELINE_CARD_COLORS.green;
  const progressAccentColor =
    progressStatus === TIMELINE_STATUS.rejected
      ? TIMELINE_CARD_COLORS.red
      : progressStatus === TIMELINE_STATUS.revision
        ? TIMELINE_CARD_COLORS.orange
        : TIMELINE_CARD_COLORS.green;
  // Dynamic short break accent color based on status
  const getShortBreakAccentColor = (status: TimelineStatus) => {
    if (status === TIMELINE_STATUS.approved) {
      return TIMELINE_CARD_COLORS.green;
    } else if (status === TIMELINE_STATUS.rejected) {
      return TIMELINE_CARD_COLORS.red;
    }
    return TIMELINE_CARD_COLORS.orange; // pending
  };
  const finalStatementAccentColor = TIMELINE_CARD_COLORS.green;

  // Calculate action required count using useMemo for better performance and readability
  const actionRequiredCount = useMemo(() => {
    let count = 0;

    // Count progress update pending as 1 action
    if (hasProgressData && progressStatus === TIMELINE_STATUS.pending) {
      count++;
    }
    // Count revision update pending as separate action only if progress is NOT pending
    // (when progress is pending, the revision is part of the same action)
    else if (
      hasProgressData &&
      revisionUpdateStatus === TIMELINE_STATUS.pending
    ) {
      count++;
    }

    // Count pending break requests
    if (hasBreakData) {
      const pendingBreaks = Object.values(shortBreakStatuses).filter(
        (status) => status === TIMELINE_STATUS.pending,
      ).length;
      count += pendingBreaks;
    }

    // Count pending final statement
    if (
      hasFinalStatementData &&
      finalStatementStatus === TIMELINE_STATUS.pending
    ) {
      count++;
    }

    // Count pending start request
    if (hasPendingStartRequest) {
      count++;
    }

    return count;
  }, [
    hasProgressData,
    progressStatus,
    revisionUpdateStatus,
    hasBreakData,
    shortBreakStatuses,
    hasFinalStatementData,
    finalStatementStatus,
    hasPendingStartRequest,
  ]);

  // Helper function to get status node for a break request
  const getShortBreakStatusNode = (status: TimelineStatus) =>
    status === TIMELINE_STATUS.approved ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : status === TIMELINE_STATUS.rejected ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : null;

  const finalStatementStatusNode =
    finalStatementStatus === TIMELINE_STATUS.approved ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : finalStatementStatus === TIMELINE_STATUS.rejected ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : null;

  const progressStatusNode =
    progressStatus === TIMELINE_STATUS.approved ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : progressStatus === TIMELINE_STATUS.rejected ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : progressStatus === TIMELINE_STATUS.revision ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
        Request Revision
      </span>
    ) : null;

  const handleProgressApprove = (keepExpanded = false) => {
    // Call API to approve work log if we have valid data
    if (apiProgressData?.logId && assignmentId) {
      actionOnWorkLog({
        body: {
          assignmentId,
          logId: apiProgressData.logId,
          action: "approve",
        },
      });
    }
    setKeepProgressExpanded(keepExpanded);
    setProgressStatus(TIMELINE_STATUS.approved);
    if (!keepExpanded) {
      setIsProgressCollapsed(true);
    }
    toast.success(TOAST_MESSAGES.progressApproved, { position: "top-right" });
  };

  const handleProgressReject = (keepExpanded = false) => {
    // Call API to reject work log if we have valid data
    if (apiProgressData?.logId && assignmentId) {
      actionOnWorkLog({
        body: {
          assignmentId,
          logId: apiProgressData.logId,
          action: "reject",
        },
      });
    }
    setKeepProgressExpanded(keepExpanded);
    setProgressStatus(TIMELINE_STATUS.rejected);
    if (!keepExpanded) {
      setIsProgressCollapsed(true);
    }
    toast.error(TOAST_MESSAGES.progressRejected, { position: "top-right" });
  };

  const handleRequestRevision = () => {
    openForm(FormMode.Revision);
  };

  const openForm = (mode: FormMode) => {
    setFormMode(mode);
    revisionFormMethods.reset({
      title: "",
      notes: "",
      attachment: undefined,
    });
    setShowFormModal(true);
    setShowFormConfirm(false);
  };

  const handleRevisionSubmit = () => {
    if (!showFormConfirm) {
      setShowFormModal(false);
      setShowFormConfirm(true);
      return;
    }
    if (!formMode) return;
    const { title, notes, attachment } = revisionFormMethods.getValues();
    const attachmentName = attachment?.[0]?.name;
    const timestamp = formatDateTime();

    // Call API to request revision if we have valid data
    if (
      apiProgressData?.logId &&
      assignmentId &&
      formMode === FormMode.Revision
    ) {
      actionOnWorkLog({
        body: {
          assignmentId,
          logId: apiProgressData.logId,
          action: "request_revision",
          clientComment: notes,
          clientAttachment: attachment?.[0]
            ? {
                filename: attachment[0].name,
                size: attachment[0].size,
                mimeType: attachment[0].type,
              }
            : undefined,
        },
      });
    }

    // Handle Revision Update (after engineer responds)
    if (formMode === FormMode.RevisionUpdate) {
      const revisionId = currentRevisionId;
      const logId = currentRevisionLogId;
      if (logId && revisionId && assignmentId) {
        actionOnWorkLog({
          body: {
            assignmentId,
            logId: logId,
            revisionId: revisionId,
            action: "request_revision",
            clientComment: notes,
            clientAttachment: attachment?.[0]
              ? {
                  filename: attachment[0].name,
                  size: attachment[0].size,
                  mimeType: attachment[0].type,
                }
              : undefined,
          },
        });
      }
    }

    setShowFormConfirm(false);
    revisionFormMethods.reset();
    setCurrentRevisionLogId(undefined);
    setCurrentRevisionId(undefined);

    if (formMode === FormMode.Revision) {
      setProgressStatus(TIMELINE_STATUS.revision);
      setIsProgressCollapsed(false);
      setRevisionRequestDetails({
        title: title || "Revision",
        notes,
        attachmentName,
        timestamp,
      });
    } else {
      setRevisionUpdateStatus(TIMELINE_STATUS.revision);
    }

    toast.success(TOAST_MESSAGES.revisionSubmitted, { position: "top-right" });
  };

  const handleFormConfirmCancel = () => {
    setShowFormConfirm(false);
    setShowFormModal(true);
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
    revisionFormMethods.reset();
  };

  const handleRevisionUpdateRequestRevision = (
    logId?: number,
    revisionId?: number,
  ) => {
    setCurrentRevisionLogId(logId);
    setCurrentRevisionId(revisionId);
    openForm(FormMode.RevisionUpdate);
  };

  // Handler for approving a revision update (with revisionId and logId)
  const handleRevisionUpdateApprove = (
    keepExpanded = false,
    revisionId?: number,
    logId?: number,
  ) => {
    const revId = revisionId || apiRevisionUpdateData?.revisionId;
    const lgId = logId || apiRevisionUpdateData?.logId;
    // Call API to approve revision if we have valid data
    if (lgId && revId && assignmentId) {
      actionOnWorkLog({
        body: {
          assignmentId,
          logId: lgId,
          revisionId: revId,
          action: "approve",
        },
      });
    }
    setKeepProgressExpanded(keepExpanded);
    setRevisionUpdateStatus(TIMELINE_STATUS.approved);
    setProgressStatus(TIMELINE_STATUS.approved);
    if (!keepExpanded) {
      setIsRevisionUpdateCollapsed(true);
      setIsProgressCollapsed(true);
    }
    toast.success(TOAST_MESSAGES.progressApproved, { position: "top-right" });
  };

  // Handler for rejecting a revision update (with revisionId and logId)
  const handleRevisionUpdateReject = (
    keepExpanded = false,
    revisionId?: number,
    logId?: number,
  ) => {
    const revId = revisionId || apiRevisionUpdateData?.revisionId;
    const lgId = logId || apiRevisionUpdateData?.logId;
    // Call API to reject revision if we have valid data
    if (lgId && revId && assignmentId) {
      actionOnWorkLog({
        body: {
          assignmentId,
          logId: lgId,
          revisionId: revId,
          action: "reject",
        },
      });
    }
    setKeepProgressExpanded(keepExpanded);
    setRevisionUpdateStatus(TIMELINE_STATUS.rejected);
    setProgressStatus(TIMELINE_STATUS.rejected);
    if (!keepExpanded) {
      setIsRevisionUpdateCollapsed(true);
      setIsProgressCollapsed(true);
    }
    toast.error(TOAST_MESSAGES.progressRejected, { position: "top-right" });
  };

  // Short Term Break Card handlers
  const handleShortBreakApprove = (requestId: number) => {
    setCurrentBreakRequestId(requestId);
    setShowShortBreakApprovalModal(true);
  };

  const handleShortBreakApprovalSubmit = () => {
    // Call API to approve break request if we have valid data
    if (currentBreakRequestId && assignmentId) {
      actionOnBreak({
        body: {
          assignmentId,
          requestId: currentBreakRequestId,
          action: "approve",
          approverComment: shortBreakNotes,
        },
      });

      setShortBreakStatuses((prev) => ({
        ...prev,
        [currentBreakRequestId]: TIMELINE_STATUS.approved,
      }));
    }

    setShowShortBreakApprovalModal(false);
    setShortBreakNotes("");
    setCurrentBreakRequestId(null);
    toast.success(TOAST_MESSAGES.shortBreakApproved, { position: "top-right" });
  };

  const handleShortBreakApprovalCancel = () => {
    setShowShortBreakApprovalModal(false);
    setShortBreakNotes("");
    setCurrentBreakRequestId(null);
  };

  const handleShortBreakReject = (requestId: number) => {
    // Call API to reject break request if we have valid data
    if (requestId && assignmentId) {
      actionOnBreak({
        body: {
          assignmentId,
          requestId: requestId,
          action: "reject",
        },
      });

      setShortBreakStatuses((prev) => ({
        ...prev,
        [requestId]: TIMELINE_STATUS.rejected,
      }));
    }

    toast.error(TOAST_MESSAGES.shortBreakRejected, { position: "top-right" });
  };

  // Final Statement Card handlers
  const handleFinalStatementApprove = () => {
    // Show confirmation popup first
    setShowFinalStatementApproveConfirm(true);
  };

  const handleFinalStatementApproveConfirm = () => {
    // Call API to approve final statement using assignment action
    if (assignmentId) {
      actionOnAssignment({
        body: {
          assignmentId,
          pendingApproval: "submission",
          action: "approve",
        },
      });
    }
    setShowFinalStatementApproveConfirm(false);
    setFinalStatementStatus(TIMELINE_STATUS.approved);
    setIsFinalStatementCollapsed(true);
    toast.success(TOAST_MESSAGES.finalStatementApproved, {
      position: "top-right",
    });
  };

  const handleFinalStatementReject = () => {
    // Show confirmation popup first
    setShowFinalStatementRejectConfirm(true);
  };

  const handleFinalStatementRejectConfirm = () => {
    // Call API to reject final statement using assignment action
    if (assignmentId) {
      actionOnAssignment({
        body: {
          assignmentId,
          pendingApproval: "submission",
          action: "reject",
        },
      });
    }
    setShowFinalStatementRejectConfirm(false);
    setFinalStatementStatus(TIMELINE_STATUS.rejected);
    setIsFinalStatementCollapsed(true);
    toast.error(TOAST_MESSAGES.finalStatementRejected, {
      position: "top-right",
    });
  };

  const statusNode =
    jobStatus === TIMELINE_STATUS.approved ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : jobStatus === TIMELINE_STATUS.rejected ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : null;

  const handleApprove = () => {
    setShowJobApproveConfirm(true);
  };

  const handleJobApproveConfirmSubmit = () => {
    if (assignmentId) {
      actionOnAssignment({
        body: {
          assignmentId,
          pendingApproval: "start",
          action: "approve",
        },
      });
    }
    setShowJobApproveConfirm(false);
    setJobStatus(TIMELINE_STATUS.approved);
    setIsJobCollapsed(true);
    toast.success(TOAST_MESSAGES.jobApproved, { position: "top-right" });
  };

  const handleJobApproveConfirmCancel = () => {
    setShowJobApproveConfirm(false);
  };

  const handleReject = () => {
    setShowJobRejectConfirm(true);
  };

  const handleJobRejectConfirmSubmit = () => {
    if (assignmentId) {
      actionOnAssignment({
        body: {
          assignmentId,
          pendingApproval: "start",
          action: "reject",
        },
      });
    }
    setShowJobRejectConfirm(false);
    setJobStatus(TIMELINE_STATUS.rejected);
    setIsJobCollapsed(true);
    toast.error(TOAST_MESSAGES.jobRejected, { position: "top-right" });
  };

  const handleJobRejectConfirmCancel = () => {
    setShowJobRejectConfirm(false);
  };

  const handleFinalStatementApproveConfirmCancel = () => {
    setShowFinalStatementApproveConfirm(false);
  };

  const handleFinalStatementRejectConfirmCancel = () => {
    setShowFinalStatementRejectConfirm(false);
  };

  const confirmModals = [
    {
      key: "revision",
      isOpen: showFormConfirm && Boolean(formMode),
      title: MODAL_TITLES.requestRevision,
      message: MODAL_MESSAGES.requestRevisionConfirm,
      confirmLabel: "Submit",
      onConfirm: handleRevisionSubmit,
      onCancel: handleFormConfirmCancel,
    },
    {
      key: "job-approve",
      isOpen: showJobApproveConfirm,
      title: MODAL_TITLES.jobApproval,
      message: MODAL_MESSAGES.jobApproveConfirm,
      confirmLabel: "Approve",
      onConfirm: handleJobApproveConfirmSubmit,
      onCancel: handleJobApproveConfirmCancel,
    },
    {
      key: "job-reject",
      isOpen: showJobRejectConfirm,
      title: MODAL_TITLES.jobRejection,
      message: MODAL_MESSAGES.jobRejectConfirm,
      confirmLabel: "Reject",
      onConfirm: handleJobRejectConfirmSubmit,
      onCancel: handleJobRejectConfirmCancel,
    },
    {
      key: "final-statement-approve",
      isOpen: showFinalStatementApproveConfirm,
      title: MODAL_TITLES.finalStatementApproval,
      message: MODAL_MESSAGES.finalStatementApproveConfirm,
      confirmLabel: "Approve",
      onConfirm: handleFinalStatementApproveConfirm,
      onCancel: handleFinalStatementApproveConfirmCancel,
    },
    {
      key: "final-statement-reject",
      isOpen: showFinalStatementRejectConfirm,
      title: MODAL_TITLES.finalStatementRejection,
      message: MODAL_MESSAGES.finalStatementRejectConfirm,
      confirmLabel: "Reject",
      onConfirm: handleFinalStatementRejectConfirm,
      onCancel: handleFinalStatementRejectConfirmCancel,
    },
  ];

  useEffect(() => {
    if (
      progressStatus === TIMELINE_STATUS.approved ||
      progressStatus === TIMELINE_STATUS.rejected
    ) {
      if (!keepProgressExpanded) {
        setIsProgressCollapsed(true);
      }
    } else if (progressStatus === TIMELINE_STATUS.revision) {
      setIsProgressCollapsed(false);
    }

    if (revisionUpdateStatus !== TIMELINE_STATUS.pending) {
      setIsRevisionUpdateCollapsed(true);
    }

    // Check if any break request is not pending
    const hasNonPendingBreak = Object.values(shortBreakStatuses).some(
      (status) => status !== TIMELINE_STATUS.pending,
    );
    if (hasNonPendingBreak) {
      setIsShortBreakCollapsed(true);
    }

    if (finalStatementStatus !== TIMELINE_STATUS.pending) {
      setIsFinalStatementCollapsed(true);
    }

    if (jobStatus !== TIMELINE_STATUS.pending) {
      setIsJobCollapsed(true);
    }
  }, [
    keepProgressExpanded,
    progressStatus,
    revisionUpdateStatus,
    shortBreakStatuses,
    finalStatementStatus,
    jobStatus,
  ]);

  // Loading state
  if (isLoadingLogs) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600 dark:text-gray-400">
            Loading timeline data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <TimelineToggleButton
        isCollapsed={
          isProgressCollapsed &&
          isRevisionUpdateCollapsed &&
          isShortBreakCollapsed &&
          isFinalStatementCollapsed &&
          isJobCollapsed
        }
        onToggle={() => {
          setIsProgressCollapsed((prev) => !prev);
          setIsRevisionUpdateCollapsed((prev) => !prev);
          setIsShortBreakCollapsed((prev) => !prev);
          setIsFinalStatementCollapsed((prev) => !prev);
          setIsJobCollapsed((prev) => !prev);
        }}
      />

      <div className="px-4 pb-4 space-y-6">
        {/* Activity Timeline Section */}
        {engineerData ||
        hasPendingProposal ||
        hasApiTimelineItems ||
        (hasFinalStatementData &&
          finalStatementStatus === TIMELINE_STATUS.pending) ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Header - Always visible */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
              {/* Left section - Show based on proposal status */}
              {engineerData ? (
                // Show engineer card when proposal is approved
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Engineer
                  </p>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {engineerData.name} • {engineerData.role}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Status:{" "}
                    {actionRequiredCount === 0
                      ? "No pending approvals"
                      : "Pending approvals"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last activity: {timelineItems[0]?.timestamp || "N/A"}
                  </p>
                </div>
              ) : hasFinalStatementData &&
                finalStatementStatus === TIMELINE_STATUS.pending ? (
                // Show final statement pending message
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Final Statement
                  </p>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Pending Your Approval
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Please review and approve or reject the final statement
                  </p>
                </div>
              ) : (
                // Show pending proposal message
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Go to Manage Proposal
                  </p>
                </div>
              )}

              {/* Right section - Feedback and expand */}
              <div className="flex items-center gap-3">
                {/* Show feedback button in header when work is completed */}
                {isWorkCompleted ? (
                  <GiveFeedbackButton
                    label="Give Feedback On Engineer"
                    targetName={engineerData?.name || "Unknown"}
                    targetRole="Engineer"
                    assignmentId={
                      engineerData?.assignmentId || assignmentId || 0
                    }
                    stopPropagation
                    textClassName="cursor-pointer font-medium text-amber-600 dark:text-amber-500"
                  />
                ) : (
                  <HiChevronDown className="h-5 w-5 text-gray-400" />
                )}
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
                >
                  <HiChevronDown
                    className={`h-5 w-5 transition-transform ${isSectionCollapsed ? "" : "rotate-180"}`}
                  />
                </button>
              </div>
            </div>

            {/* Collapsible content */}
            {!isSectionCollapsed && (
              <div className="p-4 space-y-4">
                {/* Action Required Badge - Shown inside engineer card for scoped view */}
                {actionRequiredCount > 0 && (
                  <ActionRequiredBadge count={actionRequiredCount} />
                )}

                {/* Progress Update Cards - Show PENDING/REVISION_REQUESTED progress updates in Action Required */}
                {hasProgressData &&
                  actionRequiredProgressCards.map(
                    ({
                      progressData,
                      revisionData,
                      thisLogStatus,
                      thisLogIsPending,
                      thisLogProgressStatus,
                      thisLogRevisionUpdateStatus,
                      cardData,
                    }) => {
                      // Generate status node for this specific log based on its status
                      const thisLogStatusNode = thisLogIsPending ? (
                        progressStatusNode
                      ) : thisLogStatus === "rejected" ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                          <HiXMark className="h-4 w-4" aria-hidden /> Rejected
                        </span>
                      ) : thisLogStatus === "approved" ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
                          <HiCheckCircle className="h-4 w-4" aria-hidden />{" "}
                          Approved
                        </span>
                      ) : thisLogStatus === "revision_requested" ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                          Revision Requested
                        </span>
                      ) : null;

                      return (
                        <ProgressUpdateCard
                          key={progressData.id}
                          isCollapsed={isProgressCollapsed}
                          cardData={cardData}
                          progressAccentColor={progressAccentColor}
                          progressStatus={thisLogProgressStatus}
                          progressStatusNode={thisLogStatusNode}
                          revisionRequestDetails={revisionRequestDetails}
                          revisionUpdateCardData={
                            revisionData
                              ? {
                                  id: `revision-${revisionData.logId}`,
                                  type: "revisionRequestUpdate" as const,
                                  title: "Revision Request",
                                  description:
                                    revisionData.revisions?.[0]
                                      ?.clientComment || "",
                                  timestamp:
                                    revisionData.revisions?.[0]?.createdAt ||
                                    "",
                                  accentColor: TIMELINE_CARD_COLORS.orange,
                                  buttons: [
                                    "reject",
                                    "requestRevision",
                                    "approve",
                                  ] as CardButtonType[],
                                  revisions: (revisionData.revisions?.map(
                                    (r) => ({
                                      revisionId: r.revisionId,
                                      logId: revisionData.logId,
                                      content: r.content,
                                      attachmentUrl: r.attachmentUrl,
                                      clientComment: r.clientComment,
                                      clientAttachmentUrl:
                                        r.clientAttachmentUrl,
                                      createdAt: r.createdAt,
                                      updatedAt: r.updatedAt,
                                      status: r.status,
                                    }),
                                  ) || []) as TimelineRevisionData[],
                                }
                              : {
                                  id: "no-revision",
                                  type: "revisionRequestUpdate" as const,
                                  title: "",
                                  description: "",
                                  timestamp: "",
                                  accentColor: TIMELINE_CARD_COLORS.orange,
                                  buttons: [],
                                  revisions: [],
                                }
                          }
                          revisionRequestUpdateCardData={
                            apiRevisionRequestData || {
                              id: "no-revision-request",
                              type: "revisionRequestUpdate",
                              title: "",
                              description: "",
                              timestamp: "",
                              accentColor: TIMELINE_CARD_COLORS.orange,
                              buttons: [],
                            }
                          }
                          revisionUpdateStatus={thisLogRevisionUpdateStatus}
                          onProgressReject={handleProgressReject}
                          onRequestRevision={handleRequestRevision}
                          onProgressApprove={handleProgressApprove}
                          onRevisionUpdateRequestRevision={
                            handleRevisionUpdateRequestRevision
                          }
                          onRevisionUpdateApprove={handleRevisionUpdateApprove}
                          onRevisionUpdateReject={handleRevisionUpdateReject}
                        />
                      );
                    },
                  )}

                {/* Short Term Break Cards - Show ONLY PENDING break requests in Action Required */}
                {hasBreakData &&
                  apiBreakRequestsData
                    .filter((breakData) => breakData.status === "pending")
                    .map((breakData) => {
                      const breakStatus =
                        shortBreakStatuses[breakData.requestId] ||
                        TIMELINE_STATUS.pending;
                      return (
                        <ShortBreakCard
                          key={breakData.id}
                          isCollapsed={isShortBreakCollapsed}
                          cardData={breakData}
                          shortBreakAccentColor={getShortBreakAccentColor(
                            breakStatus,
                          )}
                          shortBreakStatus={breakStatus}
                          shortBreakStatusNode={getShortBreakStatusNode(
                            breakStatus,
                          )}
                          onShortBreakReject={() =>
                            handleShortBreakReject(breakData.requestId)
                          }
                          onShortBreakApprove={() =>
                            handleShortBreakApprove(breakData.requestId)
                          }
                        />
                      );
                    })}

                {/* Final Statement Card - Only show PENDING final statements in Action Required */}
                {hasFinalStatementData &&
                  apiFinalStatementData &&
                  apiFinalStatementData.status === "pending" && (
                    <FinalStatementCard
                      isCollapsed={isFinalStatementCollapsed}
                      cardData={apiFinalStatementData}
                      finalStatementAccentColor={finalStatementAccentColor}
                      finalStatementStatus={finalStatementStatus}
                      finalStatementStatusNode={finalStatementStatusNode}
                      onFinalStatementReject={handleFinalStatementReject}
                      onFinalStatementApprove={handleFinalStatementApprove}
                    />
                  )}

                {/* Job Started Card - Show when there's job started API data OR pending start request */}
                {showJobStartedCard && jobStartedCard && (
                  <JobStartedCard
                    isCollapsed={isJobCollapsed}
                    cardData={jobStartedCard}
                    accentColor={accentColor}
                    jobStatus={
                      hasPendingStartRequest
                        ? TIMELINE_STATUS.pending
                        : jobStatus
                    }
                    statusNode={statusNode}
                    onReject={handleReject}
                    onApprove={handleApprove}
                  />
                )}

                {/* Show timeline items */}
                {timelineItems.length > 0 && (
                  <TimelineSectionHeader
                    items={timelineItems}
                    apiRevisionUpdateDataList={apiRevisionUpdateDataList}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          // No activity - show simple text
          <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-3">
            No activity yet
          </p>
        )}
      </div>

      {/* Modals - Always available regardless of collapsed state */}
      <RevisionFormModal
        isOpen={showFormModal && Boolean(formMode)}
        isRevisionMode={formMode === FormMode.Revision}
        formMethods={revisionFormMethods}
        onSubmit={handleRevisionSubmit}
        onCancel={handleFormCancel}
      />

      {confirmModals.map((modal) => (
        <ConfirmModal
          key={modal.key}
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          confirmLabel={modal.confirmLabel}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      ))}

      <ShortBreakApprovalModal
        isOpen={showShortBreakApprovalModal}
        notes={shortBreakNotes}
        onNotesChange={setShortBreakNotes}
        onCancel={handleShortBreakApprovalCancel}
        onSubmit={handleShortBreakApprovalSubmit}
      />
    </div>
  );
};

export default TimelineSection;

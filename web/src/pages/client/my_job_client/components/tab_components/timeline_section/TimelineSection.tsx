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
import TimelineList from "@/shared/components/TimelineList";
import type { TimelineCardData } from "@/pages/client/my_job_client/types";
import {
  progressUpdateCardData as progressUpdateCardDataFromDummy,
  revisionRequestUpdateCardData as revisionRequestUpdateCardDataFromDummy,
  createRevisionUpdateCardData,
  shortTermBreakCardData as shortTermBreakCardDataFromDummy,
  finalStatementCardData as finalStatementCardDataFromDummy,
  engineerTimelineData,
} from "@/dummy_data/clientTimelineDummyData";
import {
  TIMELINE_STATUS,
  TIMELINE_CARD_COLORS,
  MODAL_TITLES,
  MODAL_MESSAGES,
  TOAST_MESSAGES,
  jobStartedCardData,
  activityTimelineItems,
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
import GiveFeedbackButton from "@/shared/components/commonUI/GiveFeedbackButton";
import type {
  RevisionFormData,
  RevisionRequestDetails,
} from "./clientTimelineTypes";
import {
  useGetJobLogs,
  useClientGetAssignmentDetails,
  useClientActionOnAssignment,
} from "@/shared/apiServices/client/clientOpenApiService";

const clientTimelineCards: TimelineCardData[] = [
  progressUpdateCardDataFromDummy,
  revisionRequestUpdateCardDataFromDummy,
  shortTermBreakCardDataFromDummy,
  finalStatementCardDataFromDummy,
  jobStartedCardData,
];

const [
  revisionRequestUpdateCardData,
  shortTermBreakCardData,
  finalStatementCardData,
  jobStartedCardDataForCard,
] = clientTimelineCards;

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
  const [shortBreakStatus, setShortBreakStatus] =
    useState<TimelineStatus>(initialStatus);
  const [finalStatementStatus, setFinalStatementStatus] =
    useState<TimelineStatus>(initialStatus);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFormConfirm, setShowFormConfirm] = useState(false);
  const [showShortBreakApprovalModal, setShowShortBreakApprovalModal] =
    useState(false);
  const [showJobApproveConfirm, setShowJobApproveConfirm] = useState(false);
  const [showJobRejectConfirm, setShowJobRejectConfirm] = useState(false);
  const [shortBreakNotes, setShortBreakNotes] = useState("");
  const [keepProgressExpanded, setKeepProgressExpanded] = useState(false);
  const [revisionRequestDetails, setRevisionRequestDetails] =
    useState<RevisionRequestDetails | null>(null);
  const [revisionUpdateCardData] = useState(createRevisionUpdateCardData());
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

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

  // Fetch assignment details to get proposal statuses
  const { data: assignmentDetails } = useClientGetAssignmentDetails(
    { jobId: jobId },
    !!jobId,
  );

  // Mutation for client action on assignment (approve/reject start job)
  const { mutate: actionOnAssignment } = useClientActionOnAssignment({
    onError: (error) => {
      console.error("Assignment action failed:", error);
      toast.error("Failed to process request. Please try again.", {
        position: "top-right",
      });
    },
  });

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
      const engineerName = assignment.engineer?.name || "Engineer";
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
          details: `Work submitted by ${engineerName}`,
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
          details: `Job started with ${engineerName}`,
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
          details: `Client accepted proposal from ${engineerName}`,
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
        details: `Received proposal from ${engineerName}`,
        sortOrder: 0,
      });

      // Add "Proposal Rejected" if status is rejected
      if (status === "rejected") {
        allItems.push({
          title: "Proposal Rejected",
          timestamp: appliedDate,
          statusText: "Rejected",
          statusColor: "#ef4444",
          accentColor: "#ef4444",
          details: `Client rejected proposal from ${engineerName}`,
          sortOrder: 100,
        });
      }
    });

    // Sort by sortOrder descending (highest first = most recent first)
    allItems.sort((a, b) => b.sortOrder - a.sortOrder);
    return allItems;
  }, [assignmentDetails]);

  // Transform API data to card data
  const apiProgressData = useMemo(() => {
    if (!jobLogs?.logs?.length) return null;

    // Find the latest progress update log (supports "progress_update" and "SUBMISSION" types)
    const progressLog = jobLogs.logs.find(
      (log) =>
        log.logType === "progress_update" || log.logType === "SUBMISSION",
    );

    if (!progressLog) return null;

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
      if (progressLog.status === ("pending" as any)) {
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
    }

    return {
      id: `progress-${progressLog.id}`,
      type: "progressUpdate" as const,
      title,
      description: progressLog.details || "",
      timestamp: formatApiDate(progressLog.timestamp),
      attachments,
      accentColor: TIMELINE_CARD_COLORS.green,
      buttons: [...(["approve", "reject", "requestRevision"] as const)],
    };
  }, [jobLogs]);

  const apiBreakRequestData = useMemo(() => {
    if (!jobLogs?.breakRequests?.length) return null;

    // Find the latest break request
    const breakRequest = jobLogs.breakRequests[0];

    return {
      title: `${breakRequest.type === "short_term" ? "Short Term" : "Long Term"} Break`,
      description: breakRequest.reason || "",
      timestamp: formatApiDate(breakRequest.createdAt),
      startDate: breakRequest.startAt,
      endDate: breakRequest.endAt,
    };
  }, [jobLogs]);

  const apiFinalStatementData = useMemo(() => {
    if (!jobLogs?.signOffSheets?.length) return null;

    // Find the latest sign-off sheet
    const signOff = jobLogs.signOffSheets[0];

    return {
      title: "Final Statement",
      description: signOff.details || "",
      timestamp: formatApiDate(signOff.createdAt),
    };
  }, [jobLogs]);

  // Transform API data to timeline items
  const apiTimelineItems = useMemo(() => {
    if (!jobLogs) return [];

    const logItems = transformLogsToTimelineItems(jobLogs.logs || [], true);
    // Sort by timestamp descending (newest first)
    return logItems.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
  }, [jobLogs]);

  // Build timeline items - combines API data with fallback entries
  // Shows "Job Posted" for all jobs, and proposals from assignment details
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

    // Add proposal items from assignment details API if available
    if (proposalTimelineItems.length > 0) {
      allItems.push(...proposalTimelineItems);
    }

    // Add API logs if available (these will have real timestamps)
    if (apiTimelineItems.length > 0) {
      // Assign sortOrder based on timestamp for API items
      const apiItemsWithSortOrder = apiTimelineItems.map((item, index) => ({
        ...item,
        sortOrder: 200 + index, // Higher than proposal items
      }));
      allItems.push(...apiItemsWithSortOrder);
    }

    // Add "Proposal Received" fallback when hasProposals is true and no proposal items
    if (
      hasProposals &&
      proposalTimelineItems.length === 0 &&
      apiTimelineItems.length === 0
    ) {
      allItems.push({
        title: "Proposal Received",
        timestamp: formatDateTime(),
        statusText: "Pending",
        statusColor: "#f59e0b",
        accentColor: "#3b82f6",
        details: "Proposals received. Manage them in the Manage Proposals tab.",
        sortOrder: 0,
      });
    }

    // Sort by sortOrder descending (highest first = most recent first)
    return allItems.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
  }, [apiTimelineItems, proposalTimelineItems, hasProposals]);

  // Determine card visibility based on API data - only show cards when API has data
  const hasProgressData = apiProgressData !== null;
  const hasBreakData = apiBreakRequestData !== null;
  const hasFinalStatementData = apiFinalStatementData !== null;

  // Check if there's a pending start request (start_pending_approval status)
  const hasPendingStartRequest = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    return assignmentDetails.some(
      (a) => a.assignmentStatus === "start_pending_approval",
    );
  }, [assignmentDetails]);

  // Determine card data for JobStartedCard based on status
  const jobStartedCard = useMemo(() => {
    if (hasPendingStartRequest) {
      // Use current timestamp since API doesn't provide specific timestamp for start_pending_approval
      const timestamp = new Date().toISOString();
      return {
        ...jobStartedCardDataForCard,
        title: "Job Started",
        description:
          "Engineer has requested to start the job. Please review and approve.",
        timestamp: formatApiDate(timestamp),
      };
    }
    return jobStartedCardDataForCard;
  }, [hasPendingStartRequest, jobStartedCardDataForCard]);

  // Show JobStartedCard when there's progress data OR pending start request
  const showJobStartedCard = hasProgressData || hasPendingStartRequest;

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
  const shortBreakAccentColor = TIMELINE_CARD_COLORS.red;
  const finalStatementAccentColor = TIMELINE_CARD_COLORS.green;

  // Calculate action required count - includes pending start request
  const hasAnyApiData =
    jobLogs &&
    (jobLogs.logs?.length ||
      jobLogs.breakRequests?.length ||
      jobLogs.signOffSheets?.length);
  const actionRequiredCount =
    (hasAnyApiData
      ? [
          progressStatus,
          revisionUpdateStatus,
          shortBreakStatus,
          finalStatementStatus,
          jobStatus,
        ].filter((status) => status === TIMELINE_STATUS.pending).length
      : 0) + (hasPendingStartRequest ? 1 : 0);

  const shortBreakStatusNode =
    shortBreakStatus === TIMELINE_STATUS.approved ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : shortBreakStatus === TIMELINE_STATUS.rejected ? (
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
    setKeepProgressExpanded(keepExpanded);
    setProgressStatus(TIMELINE_STATUS.approved);
    if (!keepExpanded) {
      setIsProgressCollapsed(true);
    }
    toast.success(TOAST_MESSAGES.progressApproved, { position: "top-right" });
  };

  const handleProgressReject = (keepExpanded = false) => {
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
    setShowFormConfirm(false);
    revisionFormMethods.reset();

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

  const handleRevisionUpdateRequestRevision = () => {
    openForm(FormMode.RevisionUpdate);
  };

  // Short Term Break Card handlers
  const handleShortBreakApprove = () => {
    setShowShortBreakApprovalModal(true);
  };

  const handleShortBreakApprovalSubmit = () => {
    setShortBreakStatus(TIMELINE_STATUS.approved);
    setShortBreakNotes("");
    setShowShortBreakApprovalModal(false);
    toast.success(TOAST_MESSAGES.shortBreakApproved, { position: "top-right" });
  };

  const handleShortBreakApprovalCancel = () => {
    setShowShortBreakApprovalModal(false);
    setShortBreakNotes("");
  };

  const handleShortBreakReject = () => {
    setShortBreakStatus(TIMELINE_STATUS.rejected);
    setIsShortBreakCollapsed(true);
    toast.error(TOAST_MESSAGES.shortBreakRejected, { position: "top-right" });
  };

  // Final Statement Card handlers
  const handleFinalStatementApprove = () => {
    setFinalStatementStatus(TIMELINE_STATUS.approved);
    setIsFinalStatementCollapsed(true);
    toast.success(TOAST_MESSAGES.finalStatementApproved, {
      position: "top-right",
    });
  };

  const handleFinalStatementReject = () => {
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

    if (shortBreakStatus !== TIMELINE_STATUS.pending) {
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
    shortBreakStatus,
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
      {isSectionCollapsed ? (
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          role="button"
          tabIndex={0}
          onClick={() => setIsSectionCollapsed(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsSectionCollapsed(false);
            }
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {engineerTimelineData.engineerNumber}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {engineerTimelineData.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {engineerTimelineData.role}
                </span>
              </div>
              <div className="text-sm space-y-1">
                {actionRequiredCount > 0 ? (
                  <div className="text-gray-700 dark:text-gray-300">
                    Status:{" "}
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {actionRequiredCount} pending approval
                      {actionRequiredCount > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300">
                    Status:{" "}
                    <span className="font-medium">No pending approvals</span>
                  </div>
                )}
                <div className="text-gray-500 dark:text-gray-400">
                  Last activity: {engineerTimelineData.lastActivity}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {actionRequiredCount === 0 && (
                <GiveFeedbackButton
                  label="Give Feedback On Engineer"
                  targetName={engineerTimelineData.name}
                  targetRole={engineerTimelineData.role}
                  assignmentId={engineerTimelineData.assignmentId}
                  stopPropagation
                  textClassName="hidden sm:inline cursor-pointer"
                />
              )}
              <HiChevronDown className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end items-center gap-2 px-4 pt-3">
            {actionRequiredCount === 0 && (
              <GiveFeedbackButton
                label="Give Feedback On Engineer"
                targetName={engineerTimelineData.name}
                targetRole={engineerTimelineData.role}
                stopPropagation
                assignmentId={engineerTimelineData.assignmentId}
              />
            )}
            <div
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Collapse engineer section"
              onClick={() => setIsSectionCollapsed(true)}
            >
              <HiChevronDown className="h-5 w-5 rotate-180" />
            </div>
          </div>

          <div className="px-4 pb-4 space-y-6">
            {actionRequiredCount > 0 && (
              <ActionRequiredBadge count={actionRequiredCount} />
            )}

            {hasProgressData && (
              <ProgressUpdateCard
                isCollapsed={isProgressCollapsed}
                cardData={apiProgressData}
                progressAccentColor={progressAccentColor}
                progressStatus={progressStatus}
                progressStatusNode={progressStatusNode}
                revisionRequestDetails={revisionRequestDetails}
                revisionUpdateCardData={revisionUpdateCardData}
                revisionRequestUpdateCardData={revisionRequestUpdateCardData}
                revisionUpdateStatus={revisionUpdateStatus}
                onProgressReject={handleProgressReject}
                onRequestRevision={handleRequestRevision}
                onProgressApprove={handleProgressApprove}
                onRevisionUpdateRequestRevision={
                  handleRevisionUpdateRequestRevision
                }
              />
            )}

            {/* Short Term Break Card - Only show when API has data */}
            {hasBreakData && (
              <ShortBreakCard
                isCollapsed={isShortBreakCollapsed}
                cardData={
                  apiBreakRequestData
                    ? { ...shortTermBreakCardData, ...apiBreakRequestData }
                    : shortTermBreakCardData
                }
                shortBreakAccentColor={shortBreakAccentColor}
                shortBreakStatus={shortBreakStatus}
                shortBreakStatusNode={shortBreakStatusNode}
                onShortBreakReject={handleShortBreakReject}
                onShortBreakApprove={handleShortBreakApprove}
              />
            )}

            {/* Final Statement Card - Only show when API has data */}
            {hasFinalStatementData && (
              <FinalStatementCard
                isCollapsed={isFinalStatementCollapsed}
                cardData={
                  apiFinalStatementData
                    ? { ...finalStatementCardData, ...apiFinalStatementData }
                    : finalStatementCardData
                }
                finalStatementAccentColor={finalStatementAccentColor}
                finalStatementStatus={finalStatementStatus}
                finalStatementStatusNode={finalStatementStatusNode}
                onFinalStatementReject={handleFinalStatementReject}
                onFinalStatementApprove={handleFinalStatementApprove}
              />
            )}

            {/* Job Started Card - Show when there's progress data OR pending start request */}
            {showJobStartedCard && (
              <JobStartedCard
                isCollapsed={isJobCollapsed}
                cardData={jobStartedCard}
                accentColor={accentColor}
                jobStatus={
                  hasPendingStartRequest ? TIMELINE_STATUS.pending : jobStatus
                }
                statusNode={statusNode}
                onReject={handleReject}
                onApprove={handleApprove}
              />
            )}

            {hasProgressData && (
              <TimelineSectionHeader items={activityTimelineItems} />
            )}

            {/* Show TimelineList for job logs */}
            {timelineItems.length > 0 && <TimelineList items={timelineItems} />}

            {/* Show message when no timeline data and not loading */}
            {!hasProgressData &&
              !hasBreakData &&
              !hasFinalStatementData &&
              !isLoadingLogs &&
              timelineItems.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No timeline data available yet
                </div>
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
        </>
      )}
    </div>
  );
};

export default TimelineSection;

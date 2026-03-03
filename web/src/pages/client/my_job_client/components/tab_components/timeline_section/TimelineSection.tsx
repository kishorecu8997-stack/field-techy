import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { HiCheckCircle, HiChevronDown, HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  formatApiDate,
  transformLogsToTimelineItems,
} from "@/utils/timelineUtils";
import type {
  CardButtonType,
  TimelineRevisionData,
} from "@/pages/client/my_job_client/types";
import type { RevisionData } from "./TimelineSectionHeader";
import {
  TIMELINE_STATUS,
  TIMELINE_CARD_COLORS,
  MODAL_TITLES,
  MODAL_MESSAGES,
  TOAST_MESSAGES,
} from "@/constants/timelineConstants";
import type { TimelineStatus } from "@/constants/timelineConstants";
import ProgressUpdateCard from "./ProgressUpdateCard";
import ShortBreakCard from "./ShortBreakCard";
import FinalStatementCard from "./FinalStatementCard";
import JobStartedCard from "./JobStartedCard";
import RevisionFormModal from "./RevisionFormModal";
import ConfirmModal from "./ConfirmModal";
import ShortBreakApprovalModal from "./ShortBreakApprovalModal";
import ShortBreakRejectModal from "./ShortBreakRejectModal";
import ActionRequiredBadge from "./ActionRequiredBadge";
import TimelineSectionHeader from "./TimelineSectionHeader";
import GiveFeedbackButton from "@/shared/components/commonUI/GiveFeedbackButton";
import type { ClientGetAssignmentDetailsResponse } from "@/api";
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
  useClientRegionId,
} from "@/shared/apiServices/client/clientOpenApiService";
import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";
import { useQueryClient } from "@tanstack/react-query";

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
  assignments?: ClientGetAssignmentDetailsResponse;
}> = ({ assignmentId, jobId, hasProposals = false, assignments }) => {
  const queryClient = useQueryClient();
  const regionId = useClientRegionId();
  const [_isProgressCollapsed, setIsProgressCollapsed] = useState(false);
  const [isShortBreakCollapsed] = useState(false);
  const [isFinalStatementCollapsed, setIsFinalStatementCollapsed] =
    useState(false);
  const [isJobCollapsed, setIsJobCollapsed] = useState(false);
  const initialStatus: TimelineStatus = TIMELINE_STATUS.pending;
  const [jobStatus, setJobStatus] = useState<TimelineStatus>(initialStatus);
  const [progressStatus, setProgressStatus] =
    useState<TimelineStatus>(initialStatus);
  const progressStatusRef = React.useRef(progressStatus);
  progressStatusRef.current = progressStatus;
  const [revisionUpdateStatus, setRevisionUpdateStatus] =
    useState<TimelineStatus>(initialStatus);
  const revisionUpdateStatusRef = React.useRef(revisionUpdateStatus);
  revisionUpdateStatusRef.current = revisionUpdateStatus;
  const [shortBreakStatuses, setShortBreakStatuses] = useState<
    Record<number, TimelineStatus>
  >({});
  const shortBreakStatusesRef = React.useRef(shortBreakStatuses);
  shortBreakStatusesRef.current = shortBreakStatuses;
  const [finalStatementStatus, setFinalStatementStatus] =
    useState<TimelineStatus>(initialStatus);
  const [
    showFinalStatementApproveConfirm,
    setShowFinalStatementApproveConfirm,
  ] = useState(false);
  const [showFinalStatementRejectConfirm, setShowFinalStatementRejectConfirm] =
    useState(false);
  const [showProgressRejectConfirm, setShowProgressRejectConfirm] =
    useState(false);
  const [pendingProgressReject, setPendingProgressReject] = useState<{
    logId?: number;
    keepExpanded: boolean;
  } | null>(null);
  const [showRevisionRejectConfirm, setShowRevisionRejectConfirm] =
    useState(false);
  const [pendingRevisionReject, setPendingRevisionReject] = useState<{
    revisionId?: number;
    logId?: number;
    keepExpanded: boolean;
  } | null>(null);
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
  const [showShortBreakRejectModal, setShowShortBreakRejectModal] =
    useState(false);
  const [currentBreakRequestId, setCurrentBreakRequestId] = useState<
    number | null
  >(null);
  const [showJobApproveConfirm, setShowJobApproveConfirm] = useState(false);
  const [showJobRejectConfirm, setShowJobRejectConfirm] = useState(false);
  const [shortBreakNotes, setShortBreakNotes] = useState("");
  const [shortBreakRejectNotes, setShortBreakRejectNotes] = useState("");
  const [keepProgressExpanded, setKeepProgressExpanded] = useState(false);
  const [revisionRequestDetails, setRevisionRequestDetails] =
    useState<RevisionRequestDetails | null>(null);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(true);
  // const [isRevisionUpdateCollapsed, setIsRevisionUpdateCollapsed] = useState(false);

  const revisionFormMethods = useForm<RevisionFormData>({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      notes: "",
      attachment: undefined,
    },
  });

  // Fetch assignment details - pass both jobId and assignmentId to API
  // API accepts both parameters, so we can use either one or both
  // Ensure jobId is valid (not NaN) before passing
  const validJobId = jobId && !isNaN(jobId) ? jobId : undefined;
  const fetchedAssignmentsProp = useMemo(() => assignments, [assignments]);

  // Always fetch from API when we have jobId or assignmentId to ensure we can refetch after actions
  // The prop takes precedence but API data allows for refetching after mutations
  const {
    data: fetchedAssignmentDetailsFromApi,
    refetch: refetchAssignmentDetails,
  } = useClientGetAssignmentDetails(
    { jobId: validJobId, assignmentId },
    !!(validJobId || assignmentId),
  );

  // Use API data when available (after refetch), otherwise use prop
  // This ensures we get updated data after mutations
  const assignmentDetails =
    fetchedAssignmentDetailsFromApi || fetchedAssignmentsProp || [];
  const effectiveAssignmentId =
    assignmentId || (assignmentDetails?.[0]?.assignmentId ?? 0);
  const shouldFetchLogs = effectiveAssignmentId > 0;

  // Fetch job logs from real API
  // Note: The API /jobs/assignments/{assignmentId}/logs requires a VALID assignmentId.
  // Only fetch logs when we have a valid assignmentId.
  const { data: jobLogs, isLoading: isLoadingLogs } = useGetJobLogs(
    effectiveAssignmentId,
    shouldFetchLogs,
  );

  const { mutate: actionOnAssignment } = useClientActionOnAssignment({
    onSuccess: async () => {
      // Refetch assignment details to update hasPendingStartRequest
      refetchAssignmentDetails();
      // Also refetch job logs
      if (effectiveAssignmentId) {
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId: effectiveAssignmentId },
            query: regionId !== undefined ? { regionId } : undefined,
          });
          const exactQueryKey = getJobLogsQueryKey({
            path: { assignmentId: effectiveAssignmentId },
            query: regionId !== undefined ? { regionId } : undefined,
          });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Failed to refetch timeline:", error);
          queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        }
      }
    },
    onError: (error) => {
      console.error("Assignment action failed:", error);
      toast.error("Failed to process request. Please try again.", {
        position: "top-right",
      });
    },
  });

  const { mutate: actionOnWorkLog } = useClientActionOnWorkLog({
    onSuccess: async () => {
      if (effectiveAssignmentId) {
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId: effectiveAssignmentId },
            query: regionId !== undefined ? { regionId } : undefined,
          });
          const exactQueryKey = getJobLogsQueryKey({
            path: { assignmentId: effectiveAssignmentId },
            query: regionId !== undefined ? { regionId } : undefined,
          });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Failed to refetch timeline:", error);
          queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        }
      }
    },
    onError: (error) => {
      console.error("Work log action failed:", error);
      toast.error("Failed to process work log action. Please try again.", {
        position: "top-right",
      });
    },
  });

  const { mutate: actionOnBreak } = useClientActionOnBreak({
    onSuccess: async () => {
      if (effectiveAssignmentId) {
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId: effectiveAssignmentId },
            query: regionId !== undefined ? { regionId } : undefined,
          });
          const exactQueryKey = getJobLogsQueryKey({
            path: { assignmentId: effectiveAssignmentId },
            query: regionId !== undefined ? { regionId } : undefined,
          });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Failed to refetch timeline:", error);
          queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        }
      }
    },
    onError: (error) => {
      console.error("Break request action failed:", error);
      toast.error("Failed to process break request action. Please try again.", {
        position: "top-right",
      });
    },
  });

  const shouldShowInActivityTimeline = (log: any) => {
    if (log.logType === "progress_update" || log.logType === "SUBMISSION") {
      const status = String(log.status || "")
        .toLowerCase()
        .trim();
      return (
        status === "approved" ||
        status === "pending" ||
        status === "revision_requested"
      );
    }
    return true;
  };

  useEffect(() => {
    if (!jobLogs?.logs?.length) return;

    const progressLog = jobLogs.logs.find(
      (log) =>
        log.logType === "progress_update" || log.logType === "SUBMISSION",
    );

    const currentProgressStatus = progressStatusRef.current;
    const currentRevisionUpdateStatus = revisionUpdateStatusRef.current;

    if (progressLog) {
      if (currentProgressStatus === TIMELINE_STATUS.pending) {
        if (progressLog.status === "approved")
          setProgressStatus(TIMELINE_STATUS.approved);
        else if (progressLog.status === "rejected")
          setProgressStatus(TIMELINE_STATUS.rejected);
        else if (progressLog.status === "revision_requested")
          setProgressStatus(TIMELINE_STATUS.revision);
      }

      if (currentRevisionUpdateStatus === TIMELINE_STATUS.pending) {
        if (progressLog.revisions && progressLog.revisions.length > 0) {
          const latestRevision = progressLog.revisions[0];
          if (latestRevision.status === "approved")
            setRevisionUpdateStatus(TIMELINE_STATUS.approved);
          else if (latestRevision.status === "rejected")
            setRevisionUpdateStatus(TIMELINE_STATUS.rejected);
        }
      }
    }

    if (jobLogs.breakRequests && jobLogs.breakRequests.length > 0) {
      const newBreakStatuses: Record<number, TimelineStatus> = {};
      const currentLocalStatuses = shortBreakStatusesRef.current;

      jobLogs.breakRequests.forEach((breakRequest) => {
        if (currentLocalStatuses[breakRequest.id]) {
          newBreakStatuses[breakRequest.id] =
            currentLocalStatuses[breakRequest.id];
        } else {
          if (breakRequest.status === "approved")
            newBreakStatuses[breakRequest.id] = TIMELINE_STATUS.approved;
          else if (breakRequest.status === "rejected")
            newBreakStatuses[breakRequest.id] = TIMELINE_STATUS.rejected;
          else if (breakRequest.status === "pending")
            newBreakStatuses[breakRequest.id] = TIMELINE_STATUS.pending;
        }
      });
      setShortBreakStatuses(newBreakStatuses);
    }

    if (jobLogs.signOffSheets && jobLogs.signOffSheets.length > 0) {
      const signOff = jobLogs.signOffSheets[0];
      if (signOff.status === "approved")
        setFinalStatementStatus(TIMELINE_STATUS.approved);
      else if (signOff.status === "rejected")
        setFinalStatementStatus(TIMELINE_STATUS.rejected);
      else if (signOff.status === "pending")
        setFinalStatementStatus(TIMELINE_STATUS.pending);
    }
  }, [jobLogs]);

  const proposalTimelineItems = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return [];

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

      allItems.push({
        title: "Proposal Received",
        timestamp: appliedDate,
        statusText: "Received",
        statusColor: "#3b82f6",
        accentColor: "#3b82f6",
        sortOrder: 0,
        details: "",
      });

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

    allItems.sort((a, b) => b.sortOrder - a.sortOrder);
    return allItems;
  }, [assignmentDetails]);

  const apiProgressDataList = useMemo(() => {
    if (!jobLogs?.logs?.length) return [];
    const progressLogs = jobLogs.logs.filter(
      (log) =>
        log.logType === "progress_update" || log.logType === "SUBMISSION",
    );
    if (progressLogs.length === 0) return [];

    return progressLogs.map((progressLog) => {
      const attachments = progressLog.attachmentUrl
        ? [
            {
              name: "View Document",
              url: progressLog.attachmentUrl,
            },
          ]
        : undefined;

      let title = progressLog.title || "Progress Update";
      const logStatus = progressLog.status as string;
      if (progressLog.logType === "SUBMISSION") {
        if (logStatus === "pending") title = "Proposal Submitted";
        else if (logStatus === "approved") title = "Proposal Accepted";
        else if (logStatus === "rejected") title = "Proposal Rejected";
      } else if (
        progressLog.logType === "progress_update" &&
        logStatus === "revision_requested"
      ) {
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
        buttons: ["approve", "reject", "requestRevision"] as CardButtonType[],
        rawLog: progressLog,
      };
    });
  }, [jobLogs]);

  const apiProgressData =
    apiProgressDataList.length > 0 ? apiProgressDataList[0] : null;

  const apiRevisionUpdateDataList = useMemo((): RevisionData[] => {
    if (!jobLogs?.logs?.length) return [];
    const revisionDataList: RevisionData[] = [];

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

  const apiRevisionUpdateData =
    apiRevisionUpdateDataList.length > 0 ? apiRevisionUpdateDataList[0] : null;

  const apiRevisionRequestData = useMemo(() => {
    if (!jobLogs?.logs?.length) return null;
    const revisionRequestedLogs = jobLogs.logs.filter(
      (log) => log.status === "revision_requested",
    );
    if (revisionRequestedLogs.length === 0) return null;

    const latestLog = revisionRequestedLogs[0];
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
    return jobLogs.breakRequests.map((breakRequest) => {
      const accentColor =
        breakRequest.status === "approved"
          ? TIMELINE_CARD_COLORS.green
          : breakRequest.status === "rejected"
            ? TIMELINE_CARD_COLORS.red
            : TIMELINE_CARD_COLORS.orange;

      return {
        id: `break-${breakRequest.id}`,
        requestId: breakRequest.id,
        type: "shortTermBreak" as const,
        title: `${breakRequest.type === "short_term" ? "Short Term" : "Long Term"} Break`,
        description: breakRequest.reason || "",
        timestamp: formatApiDate(breakRequest.createdAt),
        rawTimestamp: breakRequest.createdAt,
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
    const signOff = jobLogs.signOffSheets[0];
    const attachments: Array<{ name: string; url: string }> = [];
    if (signOff.attachmentUrl) {
      attachments.push({
        name: "Work Submission",
        url: signOff.attachmentUrl,
      });
    }
    if (signOff.signatureAttachmentUrl) {
      attachments.push({
        name: "Signature",
        url: signOff.signatureAttachmentUrl,
      });
    }

    return {
      id: `final-statement-${signOff.id}`,
      type: "finalStatement" as const,
      title: "Final Statement",
      description: signOff.details || "",
      timestamp: formatApiDate(signOff.createdAt),
      rawTimestamp: signOff.createdAt,
      accentColor: TIMELINE_CARD_COLORS.green,
      buttons: ["reject", "approve"] as CardButtonType[],
      attachments: attachments.length > 0 ? attachments : undefined,
      status: signOff.status,
    };
  }, [jobLogs]);

  const apiTimelineItems = useMemo(() => {
    if (!jobLogs) return [];
    const filteredLogs =
      jobLogs.logs?.filter(shouldShowInActivityTimeline) ?? [];
    const logItems = transformLogsToTimelineItems(filteredLogs);

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
      rawTimestamp: jobStartedLog.timestamp,
      accentColor: TIMELINE_CARD_COLORS.green,
      buttons: ["reject", "approve"] as CardButtonType[],
    };
  }, [jobLogs]);

  const actionRequiredProgressCards = useMemo(() => {
    if (!apiProgressDataList?.length) return [];

    return apiProgressDataList
      .filter((progressData) => {
        const rawLog = progressData.rawLog;
        const status = String(rawLog?.status || "")
          .toLowerCase()
          .trim();

        // Skip logs that are already approved or rejected - no action needed
        if (status === "approved" || status === "rejected") {
          return false;
        }

        const revisions = rawLog?.revisions || [];
        const latestRevision = revisions[0]; // newest first
        const latestRevisionStatus = String(latestRevision?.status || "")
          .toLowerCase()
          .trim();

        // Client must act when:
        // 1. New submission (pending)
        // 2. Engineer has responded to revision (status still revision_requested + latest revision pending + has content)
        const isNewPending = status === "pending";
        const isEngineerResponded =
          status === "revision_requested" &&
          latestRevisionStatus === "pending" &&
          !!latestRevision?.content; // engineer submitted something

        return isNewPending || isEngineerResponded;
      })
      .map((progressData) => {
        const revisionData = apiRevisionUpdateDataList.find(
          (r) => r.logId === progressData.logId,
        );
        const thisLogStatus = (progressData.rawLog as { status?: string })
          ?.status;
        const thisLogIsPending =
          String(thisLogStatus).toLowerCase() === "pending";
        const latestRevision = revisionData?.revisions?.[0];
        const revisionStatus = latestRevision?.status;
        const revisionIsPending =
          String(revisionStatus).toLowerCase() === "pending";

        // Derive status directly from raw log data instead of using global state
        // This ensures each log shows its own action buttons based on its own status
        const rawLogStatus = String(thisLogStatus).toLowerCase();
        let thisLogProgressStatus: TimelineStatus;
        if (rawLogStatus === "approved") {
          thisLogProgressStatus = TIMELINE_STATUS.approved;
        } else if (rawLogStatus === "rejected") {
          thisLogProgressStatus = TIMELINE_STATUS.rejected;
        } else if (rawLogStatus === "revision_requested") {
          thisLogProgressStatus = TIMELINE_STATUS.revision;
        } else {
          thisLogProgressStatus = TIMELINE_STATUS.pending;
        }

        const thisLogRevisionUpdateStatus = revisionIsPending
          ? revisionUpdateStatus
          : TIMELINE_STATUS.approved;

        const cardData = thisLogIsPending
          ? progressData
          : { ...progressData, buttons: [] };

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
  }, [apiProgressDataList, apiRevisionUpdateDataList, revisionUpdateStatus]);

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
      itemType?: string;
      approverComment?: string | null;
      attachmentUrl?: string | null;
      attachmentName?: string;
      attachments?: Array<{ name: string; url: string }>;
    };

    const itemsMap = new Map<string, TimelineItem>();

    if (proposalTimelineItems.length > 0) {
      const sortedProposals = [...proposalTimelineItems].sort(
        (a, b) => b.sortOrder - a.sortOrder,
      );
      sortedProposals.forEach((item) => {
        if (!itemsMap.has(item.title)) {
          itemsMap.set(item.title, {
            ...item,
            effectiveTimestamp: item.timestamp,
            itemType: item.title,
          });
        }
      });
    }

    if (apiTimelineItems.length > 0) {
      apiTimelineItems.forEach((item) => {
        const uniqueKey = `progress-${item.logId}`;
        if (!itemsMap.has(uniqueKey)) {
          itemsMap.set(uniqueKey, {
            ...item,
            sortOrder: 0,
            itemType: uniqueKey,
          });
        }
      });
    }

    if (apiBreakRequestsData.length > 0) {
      apiBreakRequestsData.forEach((breakReq) => {
        if (breakReq.status === "approved" || breakReq.status === "rejected") {
          const uniqueKey = `break-${breakReq.requestId}`;
          if (!itemsMap.has(uniqueKey)) {
            itemsMap.set(uniqueKey, {
              title: breakReq.title,
              timestamp: breakReq.timestamp,
              effectiveTimestamp: breakReq.rawTimestamp || breakReq.timestamp,
              statusText:
                breakReq.status.charAt(0).toUpperCase() +
                breakReq.status.slice(1),
              statusColor:
                breakReq.status === "approved" ? "#22c55e" : "#ef4444",
              accentColor: breakReq.accentColor,
              details: breakReq.description,
              sortOrder: 0,
              itemType: uniqueKey,
              approverComment: breakReq.approverComment,
            });
          }
        }
      });
    }

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
            apiFinalStatementData.timestamp,
          statusText:
            apiFinalStatementData.status.charAt(0).toUpperCase() +
            apiFinalStatementData.status.slice(1),
          statusColor:
            apiFinalStatementData.status === "approved" ? "#22c55e" : "#ef4444",
          accentColor: apiFinalStatementData.accentColor,
          details: apiFinalStatementData.description,
          sortOrder: 0,
          itemType: uniqueKey,
          attachments: apiFinalStatementData.attachments,
        });
      }
    }

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

    const allItems = Array.from(itemsMap.values());
    return allItems.sort((a, b) => {
      const timeA = a.effectiveTimestamp || a.timestamp;
      const timeB = b.effectiveTimestamp || b.timestamp;
      const dateA = timeA ? new Date(timeA).getTime() : 0;
      const dateB = timeB ? new Date(timeB).getTime() : 0;
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

  // const hasProgressData = apiProgressDataList.length > 0;
  const hasBreakData = apiBreakRequestsData.length > 0;
  const hasFinalStatementData = apiFinalStatementData !== null;

  const hasPendingStartRequest = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    return assignmentDetails.some(
      (a) => a.assignmentStatus === "start_pending_approval",
    );
  }, [assignmentDetails]);

  const hasJobStartedData = apiJobStartedData !== null;
  const showJobStartedCard = hasJobStartedData || hasPendingStartRequest;

  const engineerData = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return null;
    const assignment = assignmentDetails[0];
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

    if (!isValidStatus || !assignment?.engineer) return null;

    const role = assignment.engineer.skills?.[0] || "Engineer";
    return {
      id: assignment.engineer.id,
      name: assignment.engineer.name,
      email: assignment.engineer.email,
      role: role,
      assignmentId: assignment.assignmentId,
    };
  }, [assignmentDetails]);

  const hasPendingProposal = useMemo(() => {
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    const status = assignmentDetails[0].assignmentStatus?.toLowerCase();
    return (
      status === "invited" ||
      status === "applied" ||
      status === "start_pending_approval"
    );
  }, [assignmentDetails]);

  const isJobCompleted = useMemo(() => {
    if (finalStatementStatus === TIMELINE_STATUS.approved) return true;
    if (!assignmentDetails || assignmentDetails.length === 0) return false;
    return assignmentDetails.some((a) => a.jobStatus === "Closed");
  }, [finalStatementStatus, assignmentDetails]);

  const isWorkCompleted = isJobCompleted;

  // const accentColor = jobStatus === TIMELINE_STATUS.rejected ? TIMELINE_CARD_COLORS.red : TIMELINE_CARD_COLORS.green;

  const progressAccentColor =
    progressStatus === TIMELINE_STATUS.rejected
      ? TIMELINE_CARD_COLORS.red
      : progressStatus === TIMELINE_STATUS.revision
        ? TIMELINE_CARD_COLORS.orange
        : TIMELINE_CARD_COLORS.green;

  const getShortBreakAccentColor = (status: TimelineStatus) => {
    if (status === TIMELINE_STATUS.approved) return TIMELINE_CARD_COLORS.green;
    if (status === TIMELINE_STATUS.rejected) return TIMELINE_CARD_COLORS.red;
    return TIMELINE_CARD_COLORS.orange;
  };

  const finalStatementAccentColor = TIMELINE_CARD_COLORS.green;

  const actionRequiredCount = useMemo(() => {
    let count = actionRequiredProgressCards.length;
    if (hasBreakData) {
      count += Object.values(shortBreakStatuses).filter(
        (s) => s === TIMELINE_STATUS.pending,
      ).length;
    }
    if (
      hasFinalStatementData &&
      finalStatementStatus === TIMELINE_STATUS.pending
    )
      count++;
    if (hasPendingStartRequest) count++;
    return count;
  }, [
    actionRequiredProgressCards.length,
    hasBreakData,
    shortBreakStatuses,
    hasFinalStatementData,
    finalStatementStatus,
    hasPendingStartRequest,
  ]);

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

  const handleProgressApprove = (keepExpanded = false, logId?: number) => {
    const targetLogId = logId ?? apiProgressData?.logId;
    if (targetLogId && effectiveAssignmentId) {
      actionOnWorkLog({
        body: {
          assignmentId: effectiveAssignmentId,
          logId: targetLogId,
          action: "approve",
        },
      });
    }
    setKeepProgressExpanded(keepExpanded);
    setProgressStatus(TIMELINE_STATUS.approved);
    if (!keepExpanded) setIsProgressCollapsed(true);
    toast.success(TOAST_MESSAGES.progressApproved, { position: "top-right" });
  };

  const handleProgressReject = (keepExpanded = false, logId?: number) => {
    // Store the pending rejection details and show confirmation
    setPendingProgressReject({ logId, keepExpanded });
    setShowProgressRejectConfirm(true);
  };

  const handleRequestRevision = (logId?: number) => {
    if (logId) {
      setCurrentRevisionLogId(logId);
    }
    openForm(FormMode.Revision);
  };

  const openForm = (mode: FormMode) => {
    setFormMode(mode);
    revisionFormMethods.reset({ title: "", notes: "", attachment: undefined });
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

    if (
      currentRevisionLogId &&
      effectiveAssignmentId &&
      formMode === FormMode.Revision
    ) {
      actionOnWorkLog({
        body: {
          assignmentId: effectiveAssignmentId,
          logId: currentRevisionLogId,
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

    if (formMode === FormMode.RevisionUpdate) {
      const revisionId = currentRevisionId;
      const logId = currentRevisionLogId;
      if (logId && revisionId && effectiveAssignmentId) {
        actionOnWorkLog({
          body: {
            assignmentId: effectiveAssignmentId,
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

  const handleRevisionUpdateApprove = (
    keepExpanded = false,
    revisionId?: number,
    logId?: number,
  ) => {
    const revId = revisionId || apiRevisionUpdateData?.revisionId;
    const lgId = logId || apiRevisionUpdateData?.logId;
    if (lgId && revId && effectiveAssignmentId) {
      actionOnWorkLog({
        body: {
          assignmentId: effectiveAssignmentId,
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
      // setIsRevisionUpdateCollapsed(true);
      setIsProgressCollapsed(true);
    }
    toast.success(TOAST_MESSAGES.progressApproved, { position: "top-right" });
  };

  const handleRevisionUpdateReject = (
    keepExpanded = false,
    revisionId?: number,
    logId?: number,
  ) => {
    // Show confirmation popup instead of directly rejecting
    handleRevisionRejectClick(keepExpanded, revisionId, logId);
  };

  const handleShortBreakApprove = (requestId: number) => {
    setCurrentBreakRequestId(requestId);
    setShowShortBreakApprovalModal(true);
  };

  const handleShortBreakApprovalSubmit = () => {
    if (currentBreakRequestId && effectiveAssignmentId) {
      actionOnBreak({
        body: {
          assignmentId: effectiveAssignmentId,
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
    setCurrentBreakRequestId(requestId);
    setShowShortBreakRejectModal(true);
  };

  const handleShortBreakRejectConfirm = () => {
    if (currentBreakRequestId && effectiveAssignmentId) {
      actionOnBreak({
        body: {
          assignmentId: effectiveAssignmentId,
          requestId: currentBreakRequestId,
          action: "reject",
          approverComment: shortBreakRejectNotes,
        },
      });
      setShortBreakStatuses((prev) => ({
        ...prev,
        [currentBreakRequestId]: TIMELINE_STATUS.rejected,
      }));
    }
    setShowShortBreakRejectModal(false);
    setShortBreakRejectNotes("");
    setCurrentBreakRequestId(null);
    toast.error(TOAST_MESSAGES.shortBreakRejected, { position: "top-right" });
  };

  const handleShortBreakRejectCancel = () => {
    setShowShortBreakRejectModal(false);
    setShortBreakRejectNotes("");
    setCurrentBreakRequestId(null);
  };

  const handleFinalStatementApprove = () => {
    setShowFinalStatementApproveConfirm(true);
  };

  const handleFinalStatementApproveConfirm = () => {
    if (effectiveAssignmentId) {
      actionOnAssignment({
        body: {
          assignmentId: effectiveAssignmentId,
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
    setShowFinalStatementRejectConfirm(true);
  };

  const handleFinalStatementRejectConfirm = () => {
    if (effectiveAssignmentId) {
      actionOnAssignment({
        body: {
          assignmentId: effectiveAssignmentId,
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

  const handleApprove = () => setShowJobApproveConfirm(true);

  const handleJobApproveConfirmSubmit = () => {
    if (effectiveAssignmentId) {
      actionOnAssignment({
        body: {
          assignmentId: effectiveAssignmentId,
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

  const handleJobApproveConfirmCancel = () => setShowJobApproveConfirm(false);

  const handleReject = () => setShowJobRejectConfirm(true);

  const handleJobRejectConfirmSubmit = () => {
    if (effectiveAssignmentId) {
      actionOnAssignment({
        body: {
          assignmentId: effectiveAssignmentId,
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

  const handleJobRejectConfirmCancel = () => setShowJobRejectConfirm(false);

  const handleFinalStatementApproveConfirmCancel = () =>
    setShowFinalStatementApproveConfirm(false);

  const handleFinalStatementRejectConfirmCancel = () =>
    setShowFinalStatementRejectConfirm(false);

  const handleProgressRejectConfirm = () => {
    if (pendingProgressReject && effectiveAssignmentId) {
      const { logId, keepExpanded } = pendingProgressReject;
      const targetLogId = logId ?? apiProgressData?.logId;
      if (targetLogId) {
        actionOnWorkLog({
          body: {
            assignmentId: effectiveAssignmentId,
            logId: targetLogId,
            action: "reject",
          },
        });
      }
      setKeepProgressExpanded(keepExpanded);
      setProgressStatus(TIMELINE_STATUS.rejected);
      if (!keepExpanded) setIsProgressCollapsed(true);
      toast.error(TOAST_MESSAGES.progressRejected, { position: "top-right" });
    }
    setShowProgressRejectConfirm(false);
    setPendingProgressReject(null);
  };

  const handleProgressRejectConfirmCancel = () => {
    setShowProgressRejectConfirm(false);
    setPendingProgressReject(null);
  };

  // Handler to show revision reject confirmation
  const handleRevisionRejectClick = (
    keepExpanded = false,
    revisionId?: number,
    logId?: number,
  ) => {
    setPendingRevisionReject({ revisionId, logId, keepExpanded });
    setShowRevisionRejectConfirm(true);
  };

  const handleRevisionRejectConfirm = () => {
    if (pendingRevisionReject && effectiveAssignmentId) {
      const { revisionId, logId, keepExpanded } = pendingRevisionReject;
      const revId = revisionId || apiRevisionUpdateData?.revisionId;
      const lgId = logId || apiRevisionUpdateData?.logId;
      if (lgId && revId) {
        actionOnWorkLog({
          body: {
            assignmentId: effectiveAssignmentId,
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
        // setIsRevisionUpdateCollapsed(true);
        setIsProgressCollapsed(true);
      }
      toast.error(TOAST_MESSAGES.revisionUpdateRejected, {
        position: "top-right",
      });
    }
    setShowRevisionRejectConfirm(false);
    setPendingRevisionReject(null);
  };

  const handleRevisionRejectConfirmCancel = () => {
    setShowRevisionRejectConfirm(false);
    setPendingRevisionReject(null);
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
    {
      key: "progress-reject",
      isOpen: showProgressRejectConfirm,
      title: MODAL_TITLES.progressReject,
      message: MODAL_MESSAGES.progressRejectConfirm,
      confirmLabel: "Reject",
      onConfirm: handleProgressRejectConfirm,
      onCancel: handleProgressRejectConfirmCancel,
    },
    {
      key: "revision-reject",
      isOpen: showRevisionRejectConfirm,
      title: MODAL_TITLES.revisionReject,
      message: MODAL_MESSAGES.revisionRejectConfirm,
      confirmLabel: "Reject",
      onConfirm: handleRevisionRejectConfirm,
      onCancel: handleRevisionRejectConfirmCancel,
    },
  ];

  useEffect(() => {
    // Auto-expand section if there are pending actions
    if (actionRequiredCount > 0) {
      setIsSectionCollapsed(false);
    }

    if (
      progressStatus === TIMELINE_STATUS.approved ||
      progressStatus === TIMELINE_STATUS.rejected
    ) {
      if (!keepProgressExpanded) setIsProgressCollapsed(true);
    } else if (progressStatus === TIMELINE_STATUS.revision) {
      setIsProgressCollapsed(false);
    }

    // if (revisionUpdateStatus !== TIMELINE_STATUS.pending) {
    //   setIsRevisionUpdateCollapsed(true);
    // }

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
    actionRequiredCount,
  ]);

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
      <div className="space-y-6">
        {engineerData ||
        hasPendingProposal ||
        apiTimelineItems.length > 0 ||
        (hasFinalStatementData &&
          finalStatementStatus === TIMELINE_STATUS.pending) ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
              {engineerData ? (
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
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Go to Manage Proposal
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                {isWorkCompleted && (
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
                )}
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsSectionCollapsed((prev) => !prev)}
                  aria-label={
                    isSectionCollapsed ? "Expand section" : "Collapse section"
                  }
                >
                  <HiChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isSectionCollapsed ? "" : "rotate-180"
                    }`}
                  />
                </button>
              </div>
            </div>

            {!isSectionCollapsed && (
              <div className="p-4 space-y-4">
                {actionRequiredCount > 0 && (
                  <ActionRequiredBadge count={actionRequiredCount} />
                )}

                {actionRequiredProgressCards.map(
                  ({
                    progressData,
                    revisionData,
                    thisLogStatus,
                    thisLogIsPending,
                    thisLogProgressStatus,
                    thisLogRevisionUpdateStatus,
                    cardData,
                  }) => {
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
                        isCollapsed={false}
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
                                  revisionData.revisions?.[0]?.clientComment ||
                                  "",
                                timestamp:
                                  revisionData.revisions?.[0]?.createdAt || "",
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
                                    clientAttachmentUrl: r.clientAttachmentUrl,
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
                        onProgressReject={() =>
                          handleProgressReject(false, progressData.logId)
                        }
                        onRequestRevision={() =>
                          handleRequestRevision(progressData.logId)
                        }
                        onProgressApprove={() =>
                          handleProgressApprove(false, progressData.logId)
                        }
                        onRevisionUpdateRequestRevision={() =>
                          handleRevisionUpdateRequestRevision(
                            progressData.logId,
                            revisionData?.revisions?.[0]?.revisionId,
                          )
                        }
                        onRevisionUpdateApprove={() =>
                          handleRevisionUpdateApprove(
                            false,
                            revisionData?.revisions?.[0]?.revisionId,
                            progressData.logId,
                          )
                        }
                        onRevisionUpdateReject={() =>
                          handleRevisionUpdateReject(
                            false,
                            revisionData?.revisions?.[0]?.revisionId,
                            progressData.logId,
                          )
                        }
                      />
                    );
                  },
                )}

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

                {/* Show JobStartedCard when:
                 * 1. apiJobStartedData exists (normal case), OR
                 * 2. hasPendingStartRequest is true but no JOB_STARTED log yet (engineer requested to start)
                 */}
                {(showJobStartedCard && apiJobStartedData) ||
                (hasPendingStartRequest && !apiJobStartedData) ? (
                  <JobStartedCard
                    isCollapsed={isJobCollapsed}
                    cardData={
                      apiJobStartedData || {
                        id: "job-started-pending",
                        type: "jobStarted",
                        title: "Job Started",
                        description:
                          "Engineer has requested to start working on the job",
                        timestamp: new Date().toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }),
                        accentColor: TIMELINE_CARD_COLORS.orange,
                        buttons: ["reject", "approve"],
                      }
                    }
                    accentColor={
                      apiJobStartedData?.accentColor ||
                      TIMELINE_CARD_COLORS.orange
                    }
                    jobStatus={
                      hasPendingStartRequest
                        ? TIMELINE_STATUS.pending
                        : jobStatus
                    }
                    statusNode={statusNode}
                    onReject={handleReject}
                    onApprove={handleApprove}
                  />
                ) : null}

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
          <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-3">
            No activity yet
          </p>
        )}
      </div>

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

      <ShortBreakRejectModal
        isOpen={showShortBreakRejectModal}
        notes={shortBreakRejectNotes}
        onNotesChange={setShortBreakRejectNotes}
        onCancel={handleShortBreakRejectCancel}
        onSubmit={handleShortBreakRejectConfirm}
      />
    </div>
  );
};

export default TimelineSection;

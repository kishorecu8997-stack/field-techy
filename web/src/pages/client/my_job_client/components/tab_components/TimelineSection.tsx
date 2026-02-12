import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheckCircle } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { formatDateTime } from "@/utils/formatDateTime";
import type { TimelineCardData } from "@/pages/client/my_job_client/types";
import {
  progressUpdateCardData as progressUpdateCardDataFromDummy,
  revisionRequestUpdateCardData as revisionRequestUpdateCardDataFromDummy,
  createRevisionUpdateCardData,
  shortTermBreakCardData as shortTermBreakCardDataFromDummy,
  finalStatementCardData as finalStatementCardDataFromDummy,
  jobStartedCardData as jobStartedCardDataFromDummy,
  activityTimelineItems,
} from "@/dummy_data/clientTimelineDummyData";
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
import ActionRequiredBadge from "./ActionRequiredBadge";
import TimelineToggleButton from "./TimelineToggleButton";
import TimelineSectionHeader from "./TimelineSectionHeader";
import type { RevisionFormData, RevisionRequestDetails } from "./clientTimelineTypes";



const clientTimelineCards: TimelineCardData[] = [
  progressUpdateCardDataFromDummy,
  revisionRequestUpdateCardDataFromDummy,
  shortTermBreakCardDataFromDummy,
  finalStatementCardDataFromDummy,
  jobStartedCardDataFromDummy,
];

const [
  progressUpdateCardData,
  revisionRequestUpdateCardData,
  shortTermBreakCardData,
  finalStatementCardData,
  jobStartedCardData,
] = clientTimelineCards;

const FormMode = {
  Revision: "revision",
  RevisionUpdate: "revisionUpdate",
} as const;

type FormMode = (typeof FormMode)[keyof typeof FormMode];

/**
 * Client timeline tab for progress, revisions, short breaks, final statements, and job approvals.
 * Uses dummy data to render cards and simulate states without API calls.
 * Collapsible cards with status chips/timestamps track each step.
 * Modal + confirm flows collect revision inputs and short-break notes.
 * Toasts provide immediate feedback on approve/reject/revision actions.
 */
const TimelineSection: React.FC = () => {
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false);
  const [isRevisionUpdateCollapsed, setIsRevisionUpdateCollapsed] = useState(false);
  const [isShortBreakCollapsed, setIsShortBreakCollapsed] = useState(false);
  const [isFinalStatementCollapsed, setIsFinalStatementCollapsed] = useState(false);
  const [isJobCollapsed, setIsJobCollapsed] = useState(false);
  const initialStatus: TimelineStatus = TIMELINE_STATUS.pending;
  const [jobStatus, setJobStatus] = useState<TimelineStatus>(initialStatus);
  const [progressStatus, setProgressStatus] = useState<TimelineStatus>(initialStatus);
  const [revisionUpdateStatus, setRevisionUpdateStatus] = useState<TimelineStatus>(initialStatus);
  const [shortBreakStatus, setShortBreakStatus] = useState<TimelineStatus>(initialStatus);
  const [finalStatementStatus, setFinalStatementStatus] = useState<TimelineStatus>(initialStatus);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFormConfirm, setShowFormConfirm] = useState(false);
  const [showShortBreakApprovalModal, setShowShortBreakApprovalModal] = useState(false);
  const [showJobApproveConfirm, setShowJobApproveConfirm] = useState(false);
  const [showJobRejectConfirm, setShowJobRejectConfirm] = useState(false);
  const [shortBreakNotes, setShortBreakNotes] = useState("");
  const [keepProgressExpanded, setKeepProgressExpanded] = useState(false);
  const [revisionRequestDetails, setRevisionRequestDetails] = useState<RevisionRequestDetails | null>(null);
  // State for revision update card data - setter can be used when API integration is added
  const [revisionUpdateCardData] = useState(
    createRevisionUpdateCardData()
  );

  const revisionFormMethods = useForm<RevisionFormData>({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      notes: "",
      attachment: undefined,
    },
  });

  const accentColor = jobStatus === TIMELINE_STATUS.rejected ? TIMELINE_CARD_COLORS.red : TIMELINE_CARD_COLORS.green;
  const progressAccentColor = progressStatus === TIMELINE_STATUS.rejected ? TIMELINE_CARD_COLORS.red : progressStatus === TIMELINE_STATUS.revision ? TIMELINE_CARD_COLORS.orange : TIMELINE_CARD_COLORS.green;
  // const revisionUpdateAccentColor = TIMELINE_CARD_COLORS.orange; // COMMENTED OUT - Revision Request Update Card is hidden
  const shortBreakAccentColor = TIMELINE_CARD_COLORS.red;
  const finalStatementAccentColor = TIMELINE_CARD_COLORS.green;

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
      setIsRevisionUpdateCollapsed(true);
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
    setShowShortBreakApprovalModal(false);
    setShortBreakNotes("");
    setShortBreakStatus(TIMELINE_STATUS.approved);
    setIsShortBreakCollapsed(true);
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
    toast.success(TOAST_MESSAGES.finalStatementApproved, { position: "top-right" });
  };

  const handleFinalStatementReject = () => {
    setFinalStatementStatus(TIMELINE_STATUS.rejected);
    setIsFinalStatementCollapsed(true);
    toast.error(TOAST_MESSAGES.finalStatementRejected, { position: "top-right" });
  };

  const statusNode =
    jobStatus === TIMELINE_STATUS.approved
      ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
            <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
          </span>
        )
      : jobStatus === TIMELINE_STATUS.rejected
        ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <HiXMark className="h-4 w-4" aria-hidden /> Rejected
            </span>
          )
        : null;

  const handleApprove = () => {
    setShowJobApproveConfirm(true);
  };

  const handleJobApproveConfirmSubmit = () => {
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
    setShowJobRejectConfirm(false);
    setJobStatus(TIMELINE_STATUS.rejected);
    setIsJobCollapsed(true);
    toast.error(TOAST_MESSAGES.jobRejected, { position: "top-right" });
  };

  const handleJobRejectConfirmCancel = () => {
    setShowJobRejectConfirm(false);
  };

  // Auto-collapse Progress card once a decision is made
  useEffect(() => {
    if (progressStatus === TIMELINE_STATUS.approved || progressStatus === TIMELINE_STATUS.rejected) {
      if (!keepProgressExpanded) {
        setIsProgressCollapsed(true);
      }
    } else if (progressStatus === TIMELINE_STATUS.revision) {
      setIsProgressCollapsed(false);
    }
  }, [keepProgressExpanded, progressStatus]);

  // Auto-collapse Revision Update card once a decision is made
  useEffect(() => {
    if (revisionUpdateStatus !== TIMELINE_STATUS.pending) {
      setIsRevisionUpdateCollapsed(true);
    }
  }, [revisionUpdateStatus]);

  // Auto-collapse Short Break card once a decision is made
  useEffect(() => {
    if (shortBreakStatus !== TIMELINE_STATUS.pending) {
      setIsShortBreakCollapsed(true);
    }
  }, [shortBreakStatus]);

  // Auto-collapse Final Statement card once a decision is made
  useEffect(() => {
    if (finalStatementStatus !== TIMELINE_STATUS.pending) {
      setIsFinalStatementCollapsed(true);
    }
  }, [finalStatementStatus]);

  // Auto-collapse Job card once a decision is made
  useEffect(() => {
    if (jobStatus !== TIMELINE_STATUS.pending) {
      setIsJobCollapsed(true);
    }
  }, [jobStatus]);

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
        {/* Action Required Badge - Always at the top */}
        <ActionRequiredBadge />

        {/* Progress Update Card */}
        <ProgressUpdateCard
          isCollapsed={isProgressCollapsed}
          cardData={progressUpdateCardData}
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
          onRevisionUpdateRequestRevision={handleRevisionUpdateRequestRevision}
        />


        {/* Short Term Break Card */}
        <ShortBreakCard
          isCollapsed={isShortBreakCollapsed}
          cardData={shortTermBreakCardData}
          shortBreakAccentColor={shortBreakAccentColor}
          shortBreakStatus={shortBreakStatus}
          shortBreakStatusNode={shortBreakStatusNode}
          onShortBreakReject={handleShortBreakReject}
          onShortBreakApprove={handleShortBreakApprove}
        />

        {/* Final Statement Card */}
        <FinalStatementCard
          isCollapsed={isFinalStatementCollapsed}
          cardData={finalStatementCardData}
          finalStatementAccentColor={finalStatementAccentColor}
          finalStatementStatus={finalStatementStatus}
          finalStatementStatusNode={finalStatementStatusNode}
          onFinalStatementReject={handleFinalStatementReject}
          onFinalStatementApprove={handleFinalStatementApprove}
        />

        {/* Job Started Card */}
        <JobStartedCard
          isCollapsed={isJobCollapsed}
          cardData={jobStartedCardData}
          accentColor={accentColor}
          jobStatus={jobStatus}
          statusNode={statusNode}
          onReject={handleReject}
          onApprove={handleApprove}
        />

        <TimelineSectionHeader items={activityTimelineItems} />
      </div>

      <RevisionFormModal
        isOpen={showFormModal && Boolean(formMode)}
        isRevisionMode={formMode === FormMode.Revision}
        formMethods={revisionFormMethods}
        onSubmit={handleRevisionSubmit}
        onCancel={handleFormCancel}
      />

      <ConfirmModal
        isOpen={showFormConfirm && Boolean(formMode)}
        title={MODAL_TITLES.requestRevision}
        message={MODAL_MESSAGES.requestRevisionConfirm}
        confirmLabel="Submit"
        onConfirm={handleRevisionSubmit}
        onCancel={handleFormConfirmCancel}
      />

      <ConfirmModal
        isOpen={showJobApproveConfirm}
        title={MODAL_TITLES.jobApproval}
        message={MODAL_MESSAGES.jobApproveConfirm}
        confirmLabel="Approve"
        onConfirm={handleJobApproveConfirmSubmit}
        onCancel={handleJobApproveConfirmCancel}
      />

      <ConfirmModal
        isOpen={showJobRejectConfirm}
        title={MODAL_TITLES.jobRejection}
        message={MODAL_MESSAGES.jobRejectConfirm}
        confirmLabel="Reject"
        onConfirm={handleJobRejectConfirmSubmit}
        onCancel={handleJobRejectConfirmCancel}
      />

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

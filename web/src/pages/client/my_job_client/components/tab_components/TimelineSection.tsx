import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import TimelineList from "@/shared/components/TimelineList";
import { HiChevronUp, HiCheckCircle } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { formatDateTime } from "@/utils/formatDateTime";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import {
  progressUpdateCardData,
  revisionRequestUpdateCardData,
  createRevisionUpdateCardData,
  shortTermBreakCardData,
  finalStatementCardData,
  jobStartedCardData,
  activityTimelineItems,
  TIMELINE_CARD_COLORS,
  MODAL_TITLES,
  MODAL_MESSAGES,
  TOAST_MESSAGES,
} from "@/dummy_data/clientTimelineDummyData";

interface RevisionFormData {
  title: string;
  notes: string;
  attachment: FileList;
}

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
  const [jobStatus, setJobStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [progressStatus, setProgressStatus] = useState<"pending" | "approved" | "rejected" | "revision">("pending");
  const [revisionUpdateStatus, setRevisionUpdateStatus] = useState<"pending" | "approved" | "rejected" | "revision">("pending");
  const [shortBreakStatus, setShortBreakStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [finalStatementStatus, setFinalStatementStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showRevisionConfirm, setShowRevisionConfirm] = useState(false);
  const [showRevisionUpdateModal, setShowRevisionUpdateModal] = useState(false);
  const [showRevisionUpdateConfirm, setShowRevisionUpdateConfirm] = useState(false);
  const [showShortBreakApprovalModal, setShowShortBreakApprovalModal] = useState(false);
  const [showJobApproveConfirm, setShowJobApproveConfirm] = useState(false);
  const [showJobRejectConfirm, setShowJobRejectConfirm] = useState(false);
  const [shortBreakNotes, setShortBreakNotes] = useState("");
  const [keepProgressExpanded, setKeepProgressExpanded] = useState(false);
  const [revisionRequestDetails, setRevisionRequestDetails] = useState<{
    title: string;
    notes: string;
    attachmentName?: string;
    timestamp: string;
  } | null>(null);
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

  const revisionUpdateFormMethods = useForm<RevisionFormData>({
    mode: "onSubmit",
    defaultValues: {
      notes: "",
      attachment: undefined,
    },
  });

  const accentColor = jobStatus === "rejected" ? TIMELINE_CARD_COLORS.red : TIMELINE_CARD_COLORS.green;
  const progressAccentColor = progressStatus === "rejected" ? TIMELINE_CARD_COLORS.red : progressStatus === "revision" ? TIMELINE_CARD_COLORS.orange : TIMELINE_CARD_COLORS.green;
  // const revisionUpdateAccentColor = TIMELINE_CARD_COLORS.orange; // COMMENTED OUT - Revision Request Update Card is hidden
  const shortBreakAccentColor = TIMELINE_CARD_COLORS.red;
  const finalStatementAccentColor = TIMELINE_CARD_COLORS.green;

  const shortBreakStatusNode =
    shortBreakStatus === "approved" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : shortBreakStatus === "rejected" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : null;

  const finalStatementStatusNode =
    finalStatementStatus === "approved" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : finalStatementStatus === "rejected" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : null;

  const progressStatusNode =
    progressStatus === "approved" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
        <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
      </span>
    ) : progressStatus === "rejected" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <HiXMark className="h-4 w-4" aria-hidden /> Rejected
      </span>
    ) : progressStatus === "revision" ? (
      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
        Request Revision
      </span>
    ) : null;

  // const revisionUpdateStatusNode = // COMMENTED OUT - Revision Request Update Card is hidden
  //   revisionUpdateStatus === "approved" ? (
  //     <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
  //       <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
  //     </span>
  //   ) : revisionUpdateStatus === "rejected" ? (
  //     <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
  //       <HiXMark className="h-4 w-4" aria-hidden /> Rejected
  //     </span>
  //   ) : revisionUpdateStatus === "revision" ? (
  //     <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
  //       Request Revision
  //     </span>
  //   ) : null;

  const handleProgressApprove = (keepExpanded = false) => {
    setKeepProgressExpanded(keepExpanded);
    setProgressStatus("approved");
    if (!keepExpanded) {
      setIsProgressCollapsed(true);
    }
    toast.success(TOAST_MESSAGES.progressApproved, { position: "top-right" });
  };

  const handleProgressReject = (keepExpanded = false) => {
    setKeepProgressExpanded(keepExpanded);
    setProgressStatus("rejected");
    if (!keepExpanded) {
      setIsProgressCollapsed(true);
    }
    toast.error(TOAST_MESSAGES.progressRejected, { position: "top-right" });
  };

  const handleRequestRevision = () => {
    setShowRevisionModal(true);
  };

  const handleRevisionSubmit = () => {
    // Form data submitted—trigger confirmation
    setShowRevisionModal(false);
    setShowRevisionConfirm(true);
  };

  const handleRevisionConfirmSubmit = () => {
    const { title, notes, attachment } = revisionFormMethods.getValues();
    const attachmentName = attachment?.[0]?.name;
    const timestamp = formatDateTime();
    setShowRevisionConfirm(false);
    revisionFormMethods.reset();
    setProgressStatus("revision");
    setIsProgressCollapsed(false);
    setRevisionRequestDetails({
      title,
      notes,
      attachmentName,
      timestamp,
    });
    toast.success(TOAST_MESSAGES.revisionSubmitted, { position: "top-right" });
  };

  const handleRevisionConfirmCancel = () => {
    setShowRevisionConfirm(false);
    // Re-open the revision form modal
    setShowRevisionModal(true);
  };

  const handleRevisionCancel = () => {
    setShowRevisionModal(false);
    revisionFormMethods.reset();
  };

  // Revision Update Card handlers - COMMENTED OUT - Revision Request Update Card is hidden
  // const handleRevisionUpdateApprove = () => {
  //   setRevisionUpdateStatus("approved");
  //   setIsRevisionUpdateCollapsed(true);
  //   toast.success(TOAST_MESSAGES.revisionUpdateApproved, { position: "top-right" });
  // };
  //
  // const handleRevisionUpdateReject = () => {
  //   setRevisionUpdateStatus("rejected");
  //   setIsRevisionUpdateCollapsed(true);
  //   toast.error(TOAST_MESSAGES.revisionUpdateRejected, { position: "top-right" });
  // };

  const handleRevisionUpdateRequestRevision = () => {
    setShowRevisionUpdateModal(true);
  };

  const handleRevisionUpdateSubmit = () => {
    // Form data submitted—trigger confirmation
    setShowRevisionUpdateModal(false);
    setShowRevisionUpdateConfirm(true);
  };

  const handleRevisionUpdateConfirmSubmit = () => {
    setShowRevisionUpdateConfirm(false);
    revisionUpdateFormMethods.reset();
    setRevisionUpdateStatus("revision");
    setIsRevisionUpdateCollapsed(true);
    toast.success(TOAST_MESSAGES.revisionSubmitted, { position: "top-right" });
  };

  const handleRevisionUpdateConfirmCancel = () => {
    setShowRevisionUpdateConfirm(false);
    setShowRevisionUpdateModal(true);
  };

  const handleRevisionUpdateCancel = () => {
    setShowRevisionUpdateModal(false);
    revisionUpdateFormMethods.reset();
  };

  // Short Term Break Card handlers
  const handleShortBreakApprove = () => {
    setShowShortBreakApprovalModal(true);
  };

  const handleShortBreakApprovalSubmit = () => {
    setShowShortBreakApprovalModal(false);
    setShortBreakNotes("");
    setShortBreakStatus("approved");
    setIsShortBreakCollapsed(true);
    toast.success(TOAST_MESSAGES.shortBreakApproved, { position: "top-right" });
  };

  const handleShortBreakApprovalCancel = () => {
    setShowShortBreakApprovalModal(false);
    setShortBreakNotes("");
  };

  const handleShortBreakReject = () => {
    setShortBreakStatus("rejected");
    setIsShortBreakCollapsed(true);
    toast.error(TOAST_MESSAGES.shortBreakRejected, { position: "top-right" });
  };

  // Final Statement Card handlers
  const handleFinalStatementApprove = () => {
    setFinalStatementStatus("approved");
    setIsFinalStatementCollapsed(true);
    toast.success(TOAST_MESSAGES.finalStatementApproved, { position: "top-right" });
  };

  const handleFinalStatementReject = () => {
    setFinalStatementStatus("rejected");
    setIsFinalStatementCollapsed(true);
    toast.error(TOAST_MESSAGES.finalStatementRejected, { position: "top-right" });
  };

  const statusNode =
    jobStatus === "approved"
      ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
            <HiCheckCircle className="h-4 w-4" aria-hidden /> Approved
          </span>
        )
      : jobStatus === "rejected"
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
    setJobStatus("approved");
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
    setJobStatus("rejected");
    setIsJobCollapsed(true);
    toast.error(TOAST_MESSAGES.jobRejected, { position: "top-right" });
  };

  const handleJobRejectConfirmCancel = () => {
    setShowJobRejectConfirm(false);
  };

  // Auto-collapse Progress card once a decision is made
  useEffect(() => {
    if (progressStatus === "approved" || progressStatus === "rejected") {
      if (!keepProgressExpanded) {
        setIsProgressCollapsed(true);
      }
    } else if (progressStatus === "revision") {
      setIsProgressCollapsed(false);
    }
  }, [keepProgressExpanded, progressStatus]);

  // Auto-collapse Revision Update card once a decision is made
  useEffect(() => {
    if (revisionUpdateStatus !== "pending") {
      setIsRevisionUpdateCollapsed(true);
    }
  }, [revisionUpdateStatus]);

  // Auto-collapse Short Break card once a decision is made
  useEffect(() => {
    if (shortBreakStatus !== "pending") {
      setIsShortBreakCollapsed(true);
    }
  }, [shortBreakStatus]);

  // Auto-collapse Final Statement card once a decision is made
  useEffect(() => {
    if (finalStatementStatus !== "pending") {
      setIsFinalStatementCollapsed(true);
    }
  }, [finalStatementStatus]);

  // Auto-collapse Job card once a decision is made
  useEffect(() => {
    if (jobStatus !== "pending") {
      setIsJobCollapsed(true);
    }
  }, [jobStatus]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-end px-4 pt-3">
        <button
          type="button"
          className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle section"
          onClick={() => {
            setIsProgressCollapsed((prev) => !prev);
            setIsRevisionUpdateCollapsed((prev) => !prev);
            setIsShortBreakCollapsed((prev) => !prev);
            setIsFinalStatementCollapsed((prev) => !prev);
            setIsJobCollapsed((prev) => !prev);
          }}
        >
          <HiChevronUp
            className={`h-5 w-5 transition-transform ${isProgressCollapsed && isRevisionUpdateCollapsed && isShortBreakCollapsed && isFinalStatementCollapsed && isJobCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div className="px-4 pb-4 space-y-6">
        {/* Action Required Badge - Always at the top */}
        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold text-red-700 bg-red-100">
          Action Required (1)
        </span>

        {/* Progress Update Card */}
        {isProgressCollapsed ? (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm flex items-center justify-between"
            style={{ borderColor: progressAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: progressAccentColor }}
              aria-hidden
            />
            <div className="flex items-center gap-3 pl-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {progressUpdateCardData.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {progressUpdateCardData.timestamp}
              </span>
              {progressStatusNode}
            </div>
          </div>
        ) : (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm"
            style={{ borderColor: progressAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: progressAccentColor }}
              aria-hidden
            />
            <div className="flex items-start justify-between gap-4 pl-2">
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {progressUpdateCardData.title}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {progressUpdateCardData.description}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                    {progressUpdateCardData.attachments?.[0]?.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {progressUpdateCardData.timestamp}
                  </span>
                  {progressStatusNode}
                </div>
                {progressStatus === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      variant="no_style"
                      onClick={() => handleProgressReject()}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="no_style"
                      onClick={handleRequestRevision}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Request Revision
                    </Button>
                    <Button
                      onClick={() => handleProgressApprove()}
                      className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {progressStatus === "revision" && revisionRequestDetails && (
              <div className="mt-4 pl-4 border-l border-gray-200">
                <p className="text-xs font-semibold text-gray-800">
                  Revision 1 - {revisionRequestDetails.title}
                </p>
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-600">Client:</p>
                      <p className="text-sm text-gray-800 mt-1">
                        {revisionRequestDetails.notes}
                      </p>
                      {revisionRequestDetails.attachmentName && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                            {revisionRequestDetails.attachmentName}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500 leading-4">
                        {revisionRequestDetails.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-700">Engineer:</p>
                      <p className="text-sm text-gray-800 mt-1">
                        {revisionUpdateCardData.description}
                      </p>
                      {revisionUpdateCardData.attachments?.[0]?.name && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                            {revisionUpdateCardData.attachments[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500 leading-4">
                        {revisionRequestUpdateCardData.timestamp}
                      </span>
                    </div>
                  </div>
                  {revisionUpdateStatus === "pending" && (
                    <div className="mt-3 flex justify-end gap-3">
                      <Button
                        variant="no_style"
                        onClick={() => handleProgressReject(true)}
                        className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Reject
                      </Button>
                      <Button
                        variant="no_style"
                        onClick={handleRevisionUpdateRequestRevision}
                        className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Request Revision
                      </Button>
                      <Button
                        onClick={() => handleProgressApprove(true)}
                        className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Revision Request Update Card - COMMENTED OUT */}
        {/* {progressStatus === "revision" ? null : isRevisionUpdateCollapsed ? (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm flex items-center justify-between"
            style={{ borderColor: revisionUpdateAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: revisionUpdateAccentColor }}
              aria-hidden
            />
            <div className="flex items-center gap-3 pl-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {revisionUpdateCardData.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {revisionUpdateCardData.timestamp}
              </span>
              {revisionUpdateStatusNode}
            </div>
          </div>
        ) : (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm"
            style={{ borderColor: revisionUpdateAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: revisionUpdateAccentColor }}
              aria-hidden
            />
            <div className="flex items-start justify-between gap-4 pl-2">
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {revisionUpdateCardData.title}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {revisionUpdateCardData.description}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                    {revisionUpdateCardData.attachments?.[0]?.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {revisionUpdateCardData.timestamp}
                  </span>
                  {revisionUpdateStatusNode}
                </div>
                {revisionUpdateStatus === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      variant="no_style"
                      onClick={handleRevisionUpdateReject}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="no_style"
                      onClick={handleRevisionUpdateRequestRevision}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Request Revision
                    </Button>
                    <Button
                      onClick={handleRevisionUpdateApprove}
                      className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) */}
        {/* END Revision Request Update Card */}

        {/* Short Term Break Card */}
        {isShortBreakCollapsed ? (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm flex items-center justify-between"
            style={{ borderColor: shortBreakAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: shortBreakAccentColor }}
              aria-hidden
            />
            <div className="flex items-center gap-3 pl-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {shortTermBreakCardData.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {shortTermBreakCardData.timestamp}
              </span>
              {shortBreakStatusNode}
            </div>
          </div>
        ) : (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm"
            style={{ borderColor: shortBreakAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: shortBreakAccentColor }}
              aria-hidden
            />
            <div className="flex items-start justify-between gap-4 pl-2">
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {shortTermBreakCardData.title}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {shortTermBreakCardData.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {shortTermBreakCardData.timestamp}
                  </span>
                  {shortBreakStatusNode}
                </div>
                {shortBreakStatus === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      variant="no_style"
                      onClick={handleShortBreakReject}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleShortBreakApprove}
                      className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Final Statement Card */}
        {isFinalStatementCollapsed ? (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm flex items-center justify-between"
            style={{ borderColor: finalStatementAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: finalStatementAccentColor }}
              aria-hidden
            />
            <div className="flex items-center gap-3 pl-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {finalStatementCardData.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {finalStatementCardData.timestamp}
              </span>
              {finalStatementStatusNode}
            </div>
          </div>
        ) : (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm"
            style={{ borderColor: finalStatementAccentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: finalStatementAccentColor }}
              aria-hidden
            />
            <div className="flex items-start justify-between gap-4 pl-2">
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {finalStatementCardData.title}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {finalStatementCardData.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {finalStatementCardData.attachments?.map((attachment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                    >
                      {attachment.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {finalStatementCardData.timestamp}
                  </span>
                  {finalStatementStatusNode}
                </div>
                {finalStatementStatus === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      variant="no_style"
                      onClick={handleFinalStatementReject}
                      className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleFinalStatementApprove}
                      className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Job Started Card */}
        {isJobCollapsed ? (
          <div
            className="relative rounded-lg border bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm flex items-center justify-between"
            style={{ borderColor: accentColor }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: accentColor }}
              aria-hidden
            />
            <div className="flex items-center gap-3 pl-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {jobStartedCardData.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {jobStartedCardData.timestamp}
              </span>
              {statusNode}
            </div>
          </div>
        ) : (
          <>
            <div
              className="relative rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm"
              style={{ borderColor: accentColor }}
            >
              <span
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                style={{ backgroundColor: accentColor }}
                aria-hidden
              />
              <div className="flex items-start justify-between gap-4 pl-2">
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {jobStartedCardData.title}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {jobStartedCardData.timestamp}
                    </span>
                    {statusNode}
                  </div>
                  {jobStatus === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        variant="no_style"
                        onClick={handleReject}
                        className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={handleApprove}
                        className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Activity Timeline
          </h3>
          <TimelineList items={activityTimelineItems} />
        </div>
      </div>

      {/* Request Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {MODAL_TITLES.requestRevision}
              </h2>

              <FormContainer
                methods={revisionFormMethods}
                onSubmit={handleRevisionSubmit}
                className="space-y-4"
              >
                <InputField
                  name="title"
                  label="Title"
                  placeholder="Enter title"
                  required
                />
                <TextareaInput
                  name="notes"
                  label="Your Notes"
                  placeholder=""
                  required
                />

                <FileUpload
                  name="attachment"
                  label="Attach File(if any)"
                  placeholder="Attachments (Guidelines, Docs)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required={false}
                />

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="no_style"
                    type="button"
                    onClick={handleRevisionCancel}
                    className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                  >
                    Submit
                  </Button>
                </div>
              </FormContainer>
            </div>
          </div>
        </div>
      )}

      {/* Request Revision Confirmation Modal */}
      {showRevisionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {MODAL_TITLES.requestRevision}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {MODAL_MESSAGES.requestRevisionConfirm}
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="no_style"
                  type="button"
                  onClick={handleRevisionConfirmCancel}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRevisionConfirmSubmit}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Approval Confirmation Modal */}
      {showJobApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {MODAL_TITLES.jobApproval}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {MODAL_MESSAGES.jobApproveConfirm}
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="no_style"
                  type="button"
                  onClick={handleJobApproveConfirmCancel}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleJobApproveConfirmSubmit}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Rejection Confirmation Modal */}
      {showJobRejectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {MODAL_TITLES.jobRejection}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {MODAL_MESSAGES.jobRejectConfirm}
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="no_style"
                  type="button"
                  onClick={handleJobRejectConfirmCancel}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleJobRejectConfirmSubmit}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Update Request Modal */}
      {showRevisionUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {MODAL_TITLES.requestRevision}
              </h2>

              <FormContainer
                methods={revisionUpdateFormMethods}
                onSubmit={handleRevisionUpdateSubmit}
                className="space-y-4"
              >
                <TextareaInput
                  name="notes"
                  label="Your Notes"
                  placeholder=""
                  required
                />

                <FileUpload
                  name="attachment"
                  label="Attach File(if any)"
                  placeholder="Attachments (Guidelines, Docs)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required={false}
                />

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="no_style"
                    type="button"
                    onClick={handleRevisionUpdateCancel}
                    className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                  >
                    Submit
                  </Button>
                </div>
              </FormContainer>
            </div>
          </div>
        </div>
      )}

      {/* Revision Update Confirmation Modal */}
      {showRevisionUpdateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {MODAL_TITLES.requestRevision}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {MODAL_MESSAGES.requestRevisionConfirm}
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="no_style"
                  type="button"
                  onClick={handleRevisionUpdateConfirmCancel}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRevisionUpdateConfirmSubmit}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Short Term Break Approval Modal */}
      {showShortBreakApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {MODAL_TITLES.shortBreakApproval}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Any Notes?
                  </label>
                  <textarea
                    value={shortBreakNotes}
                    onChange={(e) => setShortBreakNotes(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={4}
                    placeholder="Complete your work and then take a break"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="no_style"
                  type="button"
                  onClick={handleShortBreakApprovalCancel}
                  className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleShortBreakApprovalSubmit}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineSection;

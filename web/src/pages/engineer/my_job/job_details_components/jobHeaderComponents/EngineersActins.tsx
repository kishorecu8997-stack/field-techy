import { icons } from "@/config/icons";
import {
  JOB_STATUSES,
  type AssignmentStatus,
  type JobStatus,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import BreakRequestForm from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequestForm";
import FinalStatementForm from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/FinalStatementForm";
import type { ProgressUpdate, OfferedJobStatusType } from "../../types.d";
import { useEngineerRequestStart } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import { RiErrorWarningFill } from "react-icons/ri";

/**
 * Maps AssignmentStatus to OfferedJobStatusType for UI compatibility
 * AssignmentStatus = "assigned" | "accepted" | "rejected" | "applied" | "started" | "start_pending_approval" | "submitted" | "submit_pending_approval"
 * OfferedJobStatusType = "initial" | "accepted" | "declined" | "started" | "checked-in"
 */
const mapAssignmentToOfferStatus = (
  status: AssignmentStatus | undefined,
): OfferedJobStatusType | undefined => {
  if (!status) return undefined;

  switch (status) {
    case "assigned":
    case "applied":
      return "initial";
    case "accepted":
      return "accepted";
    case "rejected":
      return "declined";
    case "started":
    case "start_pending_approval":
      return "started";
    case "submitted":
    case "submit_pending_approval":
      return "checked-in";
    default:
      return "initial";
  }
};

/**
 * EngineersActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * Original UI with Send Proposal, Break Request, Final Statement, and other job actions.
 *
 * @param {EngineersActionsProps} props - Configuration props including the engineer object
 * @returns {JSX.Element} The rendered actions section
 */
const EngineersActions = ({
  setOfferJobStatus,
  setSendProposal,
  setOpen,
  setActiveTab,
  OfferJobStatus,
  status,
  setIsReportOpen,
  onAddProgressUpdate,
  onOpenFinalStatement,
  isFinalStatementSubmitted,
  isFinalStatementApproved,
  onOpenGiveClientFeedback,
  onOpenViewClientFeedback,
  assignmentId,
  // isSendProposal,
  // progressUpdates,
  numberOfVacancy,
  numberOfApprovedProposals,
  jobStartDate,
  jobEndDate,
}: {
  setOfferJobStatus?: Dispatch<
    SetStateAction<OfferedJobStatusType | undefined>
  >;
  setSendProposal?: Dispatch<SetStateAction<boolean>>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setIsReportOpen?: Dispatch<SetStateAction<boolean>>;
  setIsWorkSubmitted?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  isSendProposal?: boolean;
  status?: JobStatus | string;
  OfferJobStatus?: AssignmentStatus | OfferedJobStatusType | undefined;
  activeTab?: string;
  isDummyJob?: boolean;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  onOpenFinalStatement?: () => void;
  isFinalStatementSubmitted?: boolean;
  isFinalStatementApproved?: boolean;
  onOpenGiveClientFeedback?: () => void;
  onOpenViewClientFeedback?: () => void;
  assignmentId?: number;
  progressUpdates?: ProgressUpdate[];
  numberOfVacancy?: number;
  numberOfApprovedProposals?: number;
  jobStartDate?: string;
  jobEndDate?: string;
}) => {
  const { closePopup, showPopup } = usePopupStore();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();
  const queryClient = useQueryClient();

  // Check if there's a pending progress update
  // const hasPendingProgressUpdate = progressUpdates?.some((update) => {
  //   // Check if there's a revision with pending status
  //   if (update.revisions?.some((rev) => rev.status === "pending")) {
  //     return true;
  //   }
  //   // Check for revision_requested status
  //   if (update.statusText === "revision_requested") {
  //     return true;
  //   }
  //   // Check for Pending status (capitalized)
  //   if (update.statusText === "Pending") {
  //     return true;
  //   }
  //   // Check for pending status (lowercase) in statusText
  //   if (update.statusText === "pending") {
  //     return true;
  //   }
  //   return false;
  // });

  // Hook for requesting to start a job
  const { mutateAsync: requestStartJob, isPending: isStartingJob } =
    useEngineerRequestStart({
      assignmentId,
      onSuccess: async () => {
        toast.success("Job start request submitted successfully");
        // Update local state to show pending approval status (not started yet)
        handleUpdateOfferStatus("start_pending_approval");
        // Invalidate queries to refetch updated job data without page reload
        queryClient.invalidateQueries({ queryKey: ["engineers"] });
        queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
        // Force refetch the job details
        if (assignmentId) {
          queryClient.invalidateQueries({ 
            queryKey: ["engineer", "jobDetails", assignmentId] 
          });
        }
      },
      onError: (error) => {
        console.error("Failed to request job start:", error);
        toast.error("Failed to request job start. Please try again.");
      },
    });

  // Map AssignmentStatus to OfferedJobStatusType for internal logic
  const mappedOfferStatus = mapAssignmentToOfferStatus(
    OfferJobStatus as AssignmentStatus,
  );

  // Handler to update offer job status
  const handleUpdateOfferStatus = (newStatus: OfferedJobStatusType) => {
    setOfferJobStatus?.(newStatus);
  };

  const handleConfirmAcceptJob = async () => {
    await showPopup({
      title: "Accept Job",
      body: "Are you sure you want to accept this job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "danger",
        },
        {
          label: "Yes, accept",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Job accepted successfully");
            close(true);
            handleUpdateOfferStatus("accepted");
            // Invalidate queries to refetch updated job data
            queryClient.invalidateQueries({ queryKey: ["engineers"] });
          },
        },
      ],
    });
  };

  const handleConfirmStartJob = async () => {
    // Show confirmation popup first
    await showPopup({
      title: "Start Job",
      body: "Are you sure you want to start this job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "danger",
        },
        {
          label: "Yes, start",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              if (assignmentId) {
                await requestStartJob({ body: { assignmentId } });
              } else {
                toast.error(
                  "No assignment found. Please apply to the job first.",
                );
              }
            } catch (error) {
              console.error("Start job error:", error);
              toast.error("Failed to request job start. Please try again.");
            }
            close(true);
          },
        },
      ],
    });
  };

  const handleFinalStatement = () => {
    onOpenFinalStatement?.();
  };

  const handleSubmitWork = async () => {
    // Validate that assignmentId exists before opening the modal
    if (!assignmentId) {
      toast.error(
        "Assignment ID is not available. Please refresh and try again.",
      );
      return;
    }

    // Open Final Statement modal directly instead of switching tabs
    await showPopup({
      title: "",
      body: (
        <FinalStatementForm
          onClose={() => closePopup()}
          onAddProgressUpdate={onAddProgressUpdate}
          assignmentId={assignmentId}
        />
      ),
      bodyClassName: "overflow-visible",
      containerClassName: "overflow-visible max-h-none h-auto sm:max-w-2xl",
      actionButtons: [],
    });
  };

  const handlebreakRequest = async () => {
    await showPopup({
      title: "",
      body: (
        <BreakRequestForm
          onClose={closePopup}
          onAddProgressUpdate={onAddProgressUpdate}
          assignmentId={assignmentId}
          jobStartDate={jobStartDate}
          jobEndDate={jobEndDate}
        />
      ),
      bodyClassName: "overflow-visible",
      containerClassName: "overflow-visible max-h-none h-auto sm:max-w-2xl",
      actionButtons: [],
    });
  };

  const handleViewJobPosting = () => {
    setSendProposal?.(false);
    setActiveTab?.("Job Information");
  };

  const postStartActions = isFinalStatementSubmitted ? (
    <div className="flex flex-wrap gap-4 w-fit">
      <Button
        variant="no_style"
        className="text-white px-2 py-1 font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white hover:bg-teal-700/20 rounded-none hover:rounded-t-lg  "
        onClick={() => onOpenViewClientFeedback?.()}
        leftIcon={
          <icons.star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        }
      >
        <span>View Feedback From Client</span>
      </Button>
      <Button
        variant="no_style"
        className="text-white px-2 py-1 font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white hover:bg-teal-700/20 rounded-none hover:rounded-t-lg"
        onClick={() => onOpenGiveClientFeedback?.()}
        leftIcon={
          <icons.star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        }
      >
        <span>Give Feedback On Client</span>
      </Button>
    </div>
  ) : (
    <div className="flex flex-wrap gap-2 w-fit">
      <Button
        className="bg-teal-900 text-white px-6 py-2 rounded-md font-semibold border border-white/40 shadow-sm"
        onClick={handleFinalStatement}
      >
        Final Statement
      </Button>
      <Button
        className="bg-teal-900 text-white px-6 py-2 rounded-md font-semibold border border-white/40 shadow-sm"
        onClick={handlebreakRequest}
      >
        Break Request
      </Button>
      <Button
        className="bg-teal-900 text-white px-6 py-2 rounded-md font-semibold border border-white/40 shadow-sm"
        onClick={() => setOpen?.(true)}
      >
        Create Log
      </Button>
    </div>
  );

  // Check if THIS specific engineer has applied using assignmentId from API
  const hasAssignment = !!assignmentId;

  // Determine engineer's proposal status - ONLY from assignment data, not job status
  // This ensures each engineer sees only their own proposal status
  // Also check for submitted status when there's no assignment yet (proposal just sent)
  const isApplied = hasAssignment && OfferJobStatus === "applied";
  const isSubmitted = OfferJobStatus === "submitted" || OfferJobStatus === "applied";
  const isRejected = hasAssignment && (OfferJobStatus === "rejected" || mappedOfferStatus === "declined");
  const isJobStarted = OfferJobStatus === "started" || OfferJobStatus === "start_pending_approval";
  const isProposalAccepted = hasAssignment && (
    OfferJobStatus === "accepted" ||
    OfferJobStatus === "assigned" ||
    mappedOfferStatus === "accepted"
  );

  // Job-level status checks - these determine what ACTIONS are available
  // NOT the engineer's proposal status
  const isNew = status === JOB_STATUSES.new || status === "new";
  const isOffer = status === JOB_STATUSES.offer || status === "offer";
  const isPosted = status === JOB_STATUSES.posted;
  const isCancelled = status === JOB_STATUSES.cancelled;
  const isClosed = status === JOB_STATUSES.closed;

  // Check if job has actually started
  const hasJobStarted = OfferJobStatus === "started";

  // Check if there's a pending start request
  const hasStartPending = OfferJobStatus === "start_pending_approval";

  // Guard: can user start the job?
  const canStartJob =
    (isProposalAccepted || isOffer || OfferJobStatus === "initial") &&
    !hasStartPending &&
    !hasJobStarted;

  // Check if proposal already submitted via API (based on assignment status)
  // Only considers this specific engineer's proposal status, not other engineers
  // const hasSubmittedProposal =
  //   hasAssignment &&
  //   (OfferJobStatus === "applied" ||
  //     OfferJobStatus === "submitted" ||
  //     OfferJobStatus === "assigned" ||
  //     OfferJobStatus === "accepted" ||
  //     OfferJobStatus === "start_pending_approval" ||
  //     OfferJobStatus === "started" ||
  //     OfferJobStatus === "rejected" ||
  //     mappedOfferStatus === "initial" ||
  //     mappedOfferStatus === "checked-in" ||
  //     mappedOfferStatus === "declined");

  // Check if job is fully filled (approved proposals >= vacancies)
  const isJobFullyFilled =
    numberOfVacancy !== undefined &&
    numberOfApprovedProposals !== undefined &&
    numberOfApprovedProposals >= numberOfVacancy;

  // Extracted shared button logic to avoid duplication
  const renderJobActionButtons = () => {
    if (hasJobStarted || hasStartPending) return postStartActions;

    if (canStartJob) {
      return (
        <div className="flex flex-row gap-4">
          <Button
            className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
            onClick={handleConfirmStartJob}
            disabled={isStartingJob}
          >
            Start Job
          </Button>
          {isOffer && (
            <Button
              className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
              onClick={() => {
                setActiveKey("cancelOffer");
                setISOpenSidebar(true);
              }}
            >
              Decline
            </Button>
          )}
        </div>
      );
    }

    if (mappedOfferStatus === "initial" && isOffer) {
      return (
        <div className="flex flex-row gap-4">
          <Button
            className="bg-teal-800 text-black px-6 py-2 rounded-md font-medium border border-gray-300"
            onClick={handleConfirmAcceptJob}
          >
            Accept Job
          </Button>
          <Button
            className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
            onClick={() => {
              setActiveKey("cancelOffer");
              setISOpenSidebar(true);
            }}
          >
            Decline
          </Button>
        </div>
      );
    }

    // Default: Send Proposal / View Job Posting
    // Use assignmentId from API to determine if engineer has applied
    // This ensures each engineer sees only their own proposal status
    if (!hasAssignment) {
      // Engineer has not applied yet - show Send Proposal button
      // Check if job is fully filled - disable proposal submission
      if (isJobFullyFilled) {
        return (
          <div className="flex flex-col items-end gap-2">
            <span className="text-red-400 text-sm font-medium">
              Applications are closed. All available vacancies for this job have been filled.
            </span>
            <Button
              className="bg-gray-500 text-white px-6 py-2 rounded-md font-medium border border-gray-400 cursor-not-allowed opacity-50"
              disabled={true}
            >
              Send Proposal
            </Button>
          </div>
        );
      }
      return (
        <Button
          className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
          onClick={() => setSendProposal?.(true)}
        >
          Send Proposal
        </Button>
      );
    }

    // Engineer has applied - show View Job Posting or status
    // This correctly reflects the engineer's own proposal status from the API

    return (
      <div
        className="hover:underline cursor-pointer"
        onClick={handleViewJobPosting}
      >
        View Job Posting
      </div>
    );
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3 h-fit justify-between">
      <div
        className="flex cursor-pointer flex-row items-center gap-1 mt-3 border-b px-3"
        onClick={() => setIsReportOpen?.(true)}
      >
        <RiErrorWarningFill className="text-red-400 text-lg" />
        <span className="text-md">Report Issue</span>
      </div>
      <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
        {/* In Progress Status */}
        {hasJobStarted ? (
          <div className="flex flex-wrap gap-2 w-fit">
            <Button
              className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
              onClick={handlebreakRequest}
            >
              Break Request
            </Button>
            <Button
              className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
              onClick={() => setOpen?.(true)}
            >
              Create Log
            </Button>
            <Button
              className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
              onClick={handleSubmitWork}
            >
              Final Statement
            </Button>
          </div>
        ) : /* Final Statement Approved - Job Completed Status */
        isFinalStatementApproved ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg text-green-500">Job Completed</span>
          </div>
        ) : /* Applied Status */
        isApplied || isSubmitted ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Applied</span>
          </div>
        ) : /* Rejected Status */
        isRejected ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-red-500 w-6 h-6" />
            <span className="text-lg text-red-500">Proposal Rejected</span>
          </div>
        ) : /* Job Started Status */
        isJobStarted ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {OfferJobStatus === "start_pending_approval" ? (
              <>
                <icons.pending className="text-yellow-500 w-6 h-6" />
                <span className="text-lg text-yellow-500">
                  Start Pending Approval
                </span>
              </>
            ) : (
              <>
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg text-green-500">Job Started</span>
              </>
            )}
          </div>
        ) : /* New/Posted/Offer/Accepted/Assigned Status */
        (isNew || isPosted || isOffer || isProposalAccepted || hasAssignment) &&
          !hasStartPending ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {renderJobActionButtons()}
          </div>
        ) : /* Cancelled Status */
        isCancelled ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-red-500 w-6 h-6" />
            <span className="text-lg">Job Cancelled</span>
          </div>
        ) : /* Closed Status */
        isClosed ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Closed</span>
          </div>
        ) : /* Unknown Status */
        null}
      </span>
    </div>
  );
};

export default EngineersActions;

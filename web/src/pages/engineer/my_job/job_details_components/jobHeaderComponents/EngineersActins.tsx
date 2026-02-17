import { icons } from "@/config/icons";
import {
  JOB_STATUSES,
  type JobStatus,
  type AssignmentStatus,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import BreakRequestForm from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequestForm";
import type { ProgressUpdate, OfferedJobStatusType } from "../../types.d";
import { useEngineerRequestStart } from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * Maps AssignmentStatus to OfferedJobStatusType for UI compatibility
 * AssignmentStatus = "assigned" | "accepted" | "rejected" | "applied" | "started" | "start_pending_approval" | "submitted" | "submit_pending_approval"
 * OfferedJobStatusType = "initial" | "accepted" | "declined" | "started" | "checked-in"
 */
const mapAssignmentToOfferStatus = (
  status: AssignmentStatus | undefined
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
  setIsWorkSubmitted,
  setActiveTab,
  OfferJobStatus,
  status,
  onAddProgressUpdate,
  onOpenFinalStatement,
  assignmentId,
}: {
  setOfferJobStatus?: Dispatch<
    SetStateAction<OfferedJobStatusType | AssignmentStatus | undefined>
  >;
  setSendProposal?: Dispatch<SetStateAction<boolean>>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setIsWorkSubmitted?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  isSendProposal?: boolean;
  status?: JobStatus | string;
  OfferJobStatus?: AssignmentStatus | OfferedJobStatusType | undefined;
  activeTab?: string;
  isDummyJob?: boolean;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  onOpenFinalStatement?: () => void;
  assignmentId?: number;
}) => {
  const { closePopup, showPopup } = usePopupStore();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  // Hook for requesting to start a job
  const { mutateAsync: requestStartJob, isPending: isStartingJob } = useEngineerRequestStart({
    onSuccess: () => {
      toast.success("Job start request submitted successfully");
      handleUpdateOfferStatus("started");
    },
    onError: (error) => {
      console.error("Failed to request job start:", error);
      toast.error("Failed to request job start. Please try again.");
    },
  });

  // Map AssignmentStatus to OfferedJobStatusType for internal logic
  const mappedOfferStatus = mapAssignmentToOfferStatus(
    OfferJobStatus as AssignmentStatus
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
              // Only call API if we have a valid assignmentId
              if (assignmentId) {
                await requestStartJob({ body: { assignmentId } });
                toast.success("Job start request submitted successfully");
                handleUpdateOfferStatus("started");
              } else {
                // No assignmentId - show message that assignment is required
                toast.error("No assignment found. Please apply to the job first.");
              }
            } catch (error) {
              // Error is handled in onError callback
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

  const handlebreakRequest = async () => {
    await showPopup({
      title: "",
      body: (
        <BreakRequestForm
          onClose={closePopup}
          onAddProgressUpdate={onAddProgressUpdate}
        />
      ),
      bodyClassName: "overflow-visible",
      containerClassName: "overflow-visible max-h-none h-auto sm:max-w-2xl",
      actionButtons: [],
    });
  };

  const postStartActions = (
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

  const isApplied = (status === JOB_STATUSES.applied || status === "applied" || OfferJobStatus === "applied") && OfferJobStatus !== "accepted" && OfferJobStatus !== "assigned";
  const isNew = status === JOB_STATUSES.new || status === "new";
  const isOffer = status === JOB_STATUSES.offer || status === "offer";
  const isPosted = status === JOB_STATUSES.posted;
  const isCancelled = status === JOB_STATUSES.cancelled;
  const isClosed = status === JOB_STATUSES.closed;

  // Check if proposal is accepted (Start Job should show when proposal is accepted or assigned)
  const isProposalAccepted = OfferJobStatus === "accepted" || OfferJobStatus === "assigned" || mappedOfferStatus === "accepted";
  
  // Check if assignment exists - show Start Job whenever there's an assignmentId
  const hasAssignment = !!assignmentId;
  
  // Check if job has actually started (only true when assignment status is 'started', not 'start_pending_approval')
  const hasJobStarted = OfferJobStatus === "started";
  
  // Check if there's a pending start request
  const hasStartPending = OfferJobStatus === "start_pending_approval";
  
  return (
    <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
      <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
        {/* In Progress Status - Only show when job has actually started (client approved) */}
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
              onClick={() => {
                setIsWorkSubmitted?.(true);
                setActiveTab?.("Work Submissions");
              }}
            >
              Submit work
            </Button>
          </div>
        ) : /* Applied Status */
        isApplied ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Applied</span>
          </div>
        ) : /* New/Posted/Offer Status - Always show Start Job button unless job has started */
        (isNew || isPosted || isOffer || isProposalAccepted || hasAssignment) ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {/* If job has started, show post-start actions */}
            {hasJobStarted ? (
              postStartActions
            ) : hasStartPending ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-yellow-500 w-6 h-6" />
                <span className="text-lg">Start Pending Approval</span>
              </div>
            ) : /* Show Start Job button only when NOT pending approval */
            (hasAssignment || isProposalAccepted || isOffer) && !hasStartPending ? (
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => handleConfirmStartJob()}
                disabled={isStartingJob}
              >
                Start Job
              </Button>
            ) : (
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => setSendProposal?.(true)}
              >
                Send Proposal
              </Button>
            )}
          </div>
        ) : /* Offer Status */
        isOffer ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {/* Show Start Job button for Offer status */}
            {hasJobStarted ? (
              postStartActions
            ) : hasStartPending ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-yellow-500 w-6 h-6" />
                <span className="text-lg">Start Pending Approval</span>
              </div>
            ) : /* Show Start Job button only when NOT pending approval */
            (hasAssignment || isProposalAccepted) && !hasStartPending ? (
              <div className="flex flex-row gap-4">
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => handleConfirmStartJob()}
                  disabled={isStartingJob}
                >
                  Start Job
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
            ) : mappedOfferStatus === "initial" ? (
              <div className="flex flex-row gap-4">
                <Button
                  className="bg-teal-800 text-black px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => handleConfirmAcceptJob()}
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
            ) : hasJobStarted ? (
              <div className="flex flex-wrap gap-2 w-fit">
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => setOpen?.(true)}
                >
                  Create Log
                </Button>
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => {
                    setIsWorkSubmitted?.(true);
                    setActiveTab?.("Work Submissions");
                  }}
                >
                  Submit Work
                </Button>
              </div>
            ) : null}
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
        ) : /* Unknown Status - show nothing or waiting state */
        null}
      </span>
    </div>
  );
};

export default EngineersActions;

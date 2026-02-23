import { icons } from "@/config/icons";
import {
  JOB_STATUSES,
  type JobStatus,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import BreakRequestForm from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequestForm";
import type { ProgressUpdate, OfferedJobStatusType } from "../../types.d";

/**
 * EngineersActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * @param {EngineersActionsProps} props - Configuration props including the engineer object
 * @returns {JSX.Element} The rendered actions section
 * */
const EngineersActions = ({
  setOfferJobStatus,
  setSendProposal,
  setOpen,
  setIsWorkSubmitted,
  setActiveTab,
  isSendProposal,
  OfferJobStatus,
  status,
  activeTab,
  isDummyJob,
  onAddProgressUpdate,
  onOpenFinalStatement,
  isFinalStatementSubmitted,
  onOpenGiveClientFeedback,
  onOpenViewClientFeedback,
}: {
  setOfferJobStatus?: Dispatch<
    SetStateAction<OfferedJobStatusType | undefined>
  >;
  setSendProposal?: Dispatch<SetStateAction<boolean>>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setIsWorkSubmitted?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  isSendProposal?: boolean;
  status?: JobStatus | string;
  OfferJobStatus?: OfferedJobStatusType | undefined;
  activeTab?: string;
  isDummyJob?: boolean;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  onOpenFinalStatement?: () => void;
  isFinalStatementSubmitted?: boolean;
  onOpenGiveClientFeedback?: () => void;
  onOpenViewClientFeedback?: () => void;
}) => {
  const { closePopup, showPopup } = usePopupStore();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

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
            setOfferJobStatus?.("accepted");
          },
        },
      ],
    });
  };

  const handleConfirmStartJob = () => {
    toast.success("Job started successfully");
    setOfferJobStatus?.("started");
  };

  const handleFinalStatement = () => {
    onOpenFinalStatement?.();
  };

  const handleViewJobPosting = async () => {
    await showPopup({
      title: "View Job Posting",
      body: "Are you sure you want to view this job posting? once viewed, you cannot edit or delete it.",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "danger",
        },
        {
          label: "Yes, view",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            close(true);
            setSendProposal?.(false);
          },
        },
      ],
    });
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

  const postStartActions = isFinalStatementSubmitted ? (
    <div className="flex flex-wrap gap-4 w-fit">
      <Button
        variant="no_style"
        className="text-white px-2 py-1 font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white hover:bg-teal-700/20 rounded-none hover:rounded-t-lg  "
        onClick={() => onOpenViewClientFeedback?.()}
        leftIcon={<icons.star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
      >
        <span>View Feedback From Client</span>
      </Button>
      <Button
        variant="no_style"
        className="text-white px-2 py-1 font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white hover:bg-teal-700/20 rounded-none hover:rounded-t-lg"
        onClick={() => onOpenGiveClientFeedback?.()}
        leftIcon={<icons.star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
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

  return (
    <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
      <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
        {status === JOB_STATUSES.inProgress ? (
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
        ) : status === JOB_STATUSES.applied ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Applied</span>
          </div>
        ) : status === JOB_STATUSES.new ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {isDummyJob && activeTab === "Timeline" ? (
              OfferJobStatus === "started" ? (
                postStartActions
              ) : (
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => handleConfirmStartJob()}
                >
                  Start Job
                </Button>
              )
            ) : !isSendProposal ? (
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => setSendProposal?.(true)}
              >
                Send Proposal
              </Button>
            ) : (
              <div
                className="hover:underline cursor-pointer"
                onClick={() => handleViewJobPosting()}
              >
                View Job posting
              </div>
            )}
          </div>
        ) : status === JOB_STATUSES.offer ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {OfferJobStatus === "initial" ? (
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
            ) : OfferJobStatus === "accepted" ? (
              <div className="flex flex-row gap-4">
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => {
                    handleConfirmStartJob();
                  }}
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
            ) : OfferJobStatus === "started" ? (
              postStartActions
            ) : (
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
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Completed</span>
          </div>
        )}
      </span>
    </div>
  );
};
export default EngineersActions;

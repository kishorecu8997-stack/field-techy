import { icons } from "@/config/icons";
import { JOB_STATUSES } from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import type { JobStatus } from "../../types";

const EngineersActins = ({
  setOfferJobStatus,
  setSendProposal,
  setOpen,
  setIsWorkSubmitted,
  setActiveTab,
  isSendProposal,
  OfferJobStatus,
  status,
}: {
  setOfferJobStatus?: Dispatch<SetStateAction<string>>;
  setSendProposal?: Dispatch<SetStateAction<boolean>>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setIsWorkSubmitted?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  isSendProposal?: boolean;
  status?: JobStatus | string;
  OfferJobStatus?:
    | "initial"
    | "accepted"
    | "declined"
    | "started"
    | "checked-in"
    | undefined;
}) => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  const handleConfirmAcceptJob = async () => {
    await showPopup({
      title: "Accept Job",
      body: "Are you sure you want to accept this job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
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

  const handleConfirmStartJob = async () => {
    await showPopup({
      title: "Start Job",
      body: "Are you sure you want to start this job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, start",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Job started successfully");
            close(true);
            setOfferJobStatus?.("started");
          },
        },
      ],
    });
  };

  const handleConfirmCheckIn = async () => {
    await showPopup({
      title: "Check In",
      body: "Are you sure you want to check in this job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, check in",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Job checked in successfully");
            close(true);
            setOfferJobStatus?.("checked-in");
          },
        },
      ],
    });
  };

  const handleViewJobPosting = async () => {
    await showPopup({
      title: "View Job Posting",
      body: "Are you sure you want to view this job posting? once viewed, you cannot edit or delete it.",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
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
  return (
    <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
      <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
        {status === JOB_STATUSES.inprogress ? (
          <div className="flex flex-wrap gap-2 w-fit">
            <Button
              className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
              onClick={() => setOpen?.(true)}
            >
              Update Log
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
            {!isSendProposal ? (
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => setSendProposal?.(true)}
              >
                Send Proposal
              </Button>
            ) : (
              <div
                className="text-green-700 hover:underline cursor-pointer"
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
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => {
                  handleConfirmCheckIn();
                }}
              >
                Check in
              </Button>
            ) : (
              <div className="flex flex-wrap gap-2 w-fit">
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => setOpen?.(true)}
                >
                  Update Log
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
export default EngineersActins;

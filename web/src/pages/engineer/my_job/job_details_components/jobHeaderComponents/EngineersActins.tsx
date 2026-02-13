import { icons } from "@/config/icons";
import {
  JOB_STATUSES,
  type JobStatus,
  ASSIGNMENT_STATUSES,
  type AssignmentStatus,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import BreakRequest from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequest";
import { useEngineerRequestStart } from "@/shared/apiServices/engineer/engineerOpenApiService";

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
  setActiveTab,
  isSendProposal,
  OfferJobStatus,
  status,
  assignmentId,
}: {
  setOfferJobStatus?: Dispatch<SetStateAction<AssignmentStatus | undefined>>;
  setSendProposal?: Dispatch<SetStateAction<boolean>>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  isSendProposal?: boolean;
  status?: JobStatus | AssignmentStatus | string;
  OfferJobStatus?: AssignmentStatus;
  assignmentId?: number;
}) => {
  const { closePopup, showPopup } = usePopupStore();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  const { mutate: requestStart } = useEngineerRequestStart({
    onSuccess: () => {
      toast.success("Job started successfully");
      setOfferJobStatus?.("started");
    },
    onError: (err: unknown) => {
      const errorMessage =
        (err as { message?: string })?.message || "Failed to start job";
      toast.error(errorMessage);
    },
  });

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

  const handleConfirmStartJob = async () => {
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
            if (assignmentId) {
              requestStart({ body: { assignmentId } });
              close(true);
            } else {
              toast.error("Unable to start the job: Missing assignment ID");
            }
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
      body: <BreakRequest onClose={closePopup} />,
      actionButtons: [],
    });
  };

  return (
    // This is old code it should be maintained till the new code is ready

    // <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
    //   <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">

    //     {/* if the job is in progress the engineer can break request, update log and submit work */}
    //     {status === JOB_STATUSES.inProgress ? (
    //       <div className="flex flex-wrap gap-2 w-fit">
    //         <Button
    //           className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //           onClick={handlebreakRequest}
    //         >
    //           Break Request
    //         </Button>
    //         <Button
    //           className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //           onClick={() => setOpen?.(true)}
    //         >
    //           Update Log
    //         </Button>
    //         <Button
    //           className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //           onClick={() => {
    //             setActiveTab?.("Work Submissions");
    //           }}
    //         >
    //           Submit work
    //         </Button>
    //       </div>
    //     )
    //       // if the job is applied the engineer can see the job applied status
    //       : status === JOB_STATUSES.applied ? (
    //         <div className="flex flex-wrap gap-2 w-fit items-center">
    //           <icons.checkCircle className="text-green-500 w-6 h-6" />
    //           <span className="text-lg">Job Applied</span>
    //         </div>
    //       )
    //         // if the job is new the engineer can send proposal
    //         : status === JOB_STATUSES.new ? (
    //           <div className="flex flex-wrap gap-2 w-fit items-center">
    //             {!isSendProposal ? (
    //               <Button
    //                 className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                 onClick={() => setSendProposal?.(true)}
    //               >
    //                 Send Proposal
    //               </Button>
    //             ) : (
    //               <div
    //                 className="hover:underline cursor-pointer "
    //                 onClick={() => handleViewJobPosting()}
    //               >
    //                 View Job posting
    //               </div>
    //             )}
    //           </div>
    //           // if the job is offer the engineer can accept or decline the offer
    //         ) : status === JOB_STATUSES.offer ? (
    //           <div className="flex flex-wrap gap-2 w-fit items-center">
    //             {/* if the offer is initial the engineer can accept or decline the offer */}
    //             {OfferJobStatus === "initial" ? (
    //               <div className="flex flex-row gap-4">
    //                 <Button
    //                   className="bg-teal-800 text-black px-6 py-2 rounded-md font-medium border border-gray-300"
    //                   onClick={() => handleConfirmAcceptJob()}
    //                 >
    //                   Accept Job
    //                 </Button>

    //                 <Button
    //                   className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                   onClick={() => {
    //                     setActiveKey("cancelOffer");
    //                     setISOpenSidebar(true);
    //                   }}
    //                 >
    //                   Decline
    //                 </Button>
    //               </div>
    //             ) : OfferJobStatus === "accepted" ? (
    //               // the engineer can start the job once he accepted the offer
    //               <div className="flex flex-row gap-4">
    //                 <Button
    //                   className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                   onClick={() => {
    //                     handleConfirmStartJob();
    //                   }}
    //                 >
    //                   Start Job
    //                 </Button>

    //                 <Button
    //                   className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                   onClick={() => {
    //                     setActiveKey("cancelOffer");
    //                     setISOpenSidebar(true);
    //                   }}
    //                 >
    //                   Decline
    //                 </Button>
    //               </div>
    //             ) : OfferJobStatus === "started" ? (
    //               // the engineer can only check
    //               <Button
    //                 className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                 onClick={() => {
    //                   handleConfirmCheckIn();
    //                 }}
    //               >
    //                 Check in
    //               </Button>
    //             ) : (
    //               // after complete a day of work the engineer can update the log and submit the work
    //               <div className="flex flex-wrap gap-2 w-fit">
    //                 <Button
    //                   className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                   onClick={() => setOpen?.(true)}
    //                 >
    //                   Update Log
    //                 </Button>
    //                 <Button
    //                   className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
    //                   onClick={() => {
    //                     setActiveTab?.("Work Submissions");
    //                   }}
    //                 >
    //                   Submit Work
    //                 </Button>
    //               </div>
    //             )}
    //           </div>
    //         ) : (
    //           // after job is completed
    //           <div className="flex flex-wrap gap-2 w-fit items-center">
    //             <icons.checkCircle className="text-green-500 w-6 h-6" />
    //             <span className="text-lg">Job Completed</span>
    //           </div>
    //         )}
    //   </span>
    // </div>

    // new code, something is missing compare to old code, please update the code
    <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
      <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
        {/* if the job is in progress the engineer can break request, update log and submit work */}
        {status === JOB_STATUSES.inProgress ? (
          <>
            {OfferJobStatus === ASSIGNMENT_STATUSES.started ? (
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
                  Update Log
                </Button>
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => {
                    setActiveTab?.("Work Submissions");
                  }}
                >
                  Submit Work
                </Button>
              </div>
            ) : OfferJobStatus === ASSIGNMENT_STATUSES.accepted ? (
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
            ) : OfferJobStatus === ASSIGNMENT_STATUSES.assigned ? (
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
            ) : OfferJobStatus === ASSIGNMENT_STATUSES.rejected ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Rejected</span>
              </div>
            ) : OfferJobStatus === ASSIGNMENT_STATUSES.startPendingApproval ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Start Pending Approval</span>
              </div>
            ) : OfferJobStatus === ASSIGNMENT_STATUSES.submitPendingApproval ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Start Pending Approval</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Pending</span>
              </div>
            )}
          </>
        ) : status === JOB_STATUSES.cancelled ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Cancelled</span>
          </div>
        ) : status === JOB_STATUSES.flagged ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Flagged</span>
          </div>
        ) : status === JOB_STATUSES.closed ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Closed</span>
          </div>
        ) : status === JOB_STATUSES.posted ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            {OfferJobStatus === ASSIGNMENT_STATUSES.applied ? (
              <div className="flex flex-wrap gap-2 w-fit items-center">
                <icons.checkCircle className="text-green-500 w-6 h-6" />
                <span className="text-lg">Job Applied</span>
              </div>
            ) : !isSendProposal ? (
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => setSendProposal?.(true)}
              >
                Send Proposal
              </Button>
            ) : (
              <div
                className="hover:underline cursor-pointer "
                onClick={() => handleViewJobPosting()}
              >
                View Job posting
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-green-500 w-6 h-6" />
            <span className="text-lg">Job Pending</span>
          </div>
        )}
      </span>
    </div>
  );
};
export default EngineersActions;

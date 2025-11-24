import { icons } from "@/config/icons";
import { validateDescription } from "@/pages/engineer/home/validation";
import {
  JOB_STATUSES,
  WORKING_TYPES,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import Popup from "@/shared/components/Popup";
import useDrawerStore from "@/shared/store/useDrawerStore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { JobHeaderCardProps } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * Displays the main header card for a job with title, client, duration, type, and status.
 */
const JobHeaderCard: React.FC<JobHeaderCardProps> = ({
  title,
  client,
  duration,
  type,
  status = "new",
  setIsWorkSubmitted,
  setSendProposal,
  isSendProposal,
  setIsJobAccepted,
  setActiveTab,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isAccepted, setIsAccepted] = React.useState(false);
  const [isStarted, setIsStarted] = React.useState(false);
  const [isCheckedIn, setIsCheckedIn] = React.useState(false);

  const { setActiveKey, setISOpenSidebar } = useDrawerStore();
  const { showPopup } = usePopupStore();

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
            setIsAccepted?.(true);
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
            setIsStarted?.(true);
            setIsCheckedIn?.(false);
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
            setIsJobAccepted?.(true);
            setIsCheckedIn?.(true);
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
    <>
      <div
        className={`${
          isSendProposal
            ? "text-gray-800 bg-yellow-50"
            : "bg-teal-800 text-white"
        } p-5 rounded-xl shadow-md`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900 whitespace-nowrap">
            {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
          <span className="flex items-center gap-1">🕒 {duration}</span>
          <span>Client: {client}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
          <span className="flex rounded-md text-sm font-medium h-fit justify-end items-end w-fit">
            {status === JOB_STATUSES.inprogress ? (
              <div className="flex flex-wrap gap-2 w-fit">
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => setOpen(true)}
                >
                  Update Log
                </Button>
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => {
                    setIsWorkSubmitted?.(true);
                    setActiveTab("Work Submissions");
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
                {!isAccepted && !isStarted ? (
                  /* BEFORE ACCEPTING THE JOB */
                  <div className="flex flex-row gap-4">
                    <Button
                      className="bg-teal-800 text-black px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => {
                        handleConfirmAcceptJob();
                      }}
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
                ) : isAccepted && !isStarted ? (
                  /* JOB ACCEPTED, READY TO START */
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
                ) : isStarted && !isCheckedIn ? (
                  /* WORK STARTED, BUT NOT CHECKED IN */
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                    onClick={() => {
                      handleConfirmCheckIn();
                    }}
                  >
                    Check in
                  </Button>
                ) : (
                  /* CHECKED IN — SHOW WORK ACTIONS */
                  <div className="flex flex-wrap gap-2 w-fit">
                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => setOpen(true)}
                    >
                      Update Log
                    </Button>
                    <Button
                      className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                      onClick={() => {
                        setIsWorkSubmitted?.(true);
                        setActiveTab("Work Submissions");
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
      </div>
      <Popup open={open} onClose={() => setOpen(false)}>
        <UpdateStatus onClose={() => setOpen(false)} />
      </Popup>
    </>
  );
};

export default JobHeaderCard;

const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const FormCtx = useForm();
  const { showPopup } = usePopupStore();

  const handleSubmit = async () => {
    await showPopup({
      title: "Update Status",
      body: "Are you sure you want to update this job status?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Job status updated successfully");
            close(true);
            onClose();
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-end">
        <button
          className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <icons.close className="w-6 h-6" />
        </button>
      </div>
      <div className="text-xl text-gray-900 dark:text-white font-bold text-center">
        Update Status
      </div>
      <FormContainer methods={FormCtx} onSubmit={handleSubmit}>
        <SelectField
          name="status"
          label="Status"
          required
          options={[
            { label: "In Progress", value: "in-progress" },
            { label: "Completed", value: "completed" },
          ]}
        />
        <TextareaInput
          name="remarks"
          label="Remarks"
          required
          rules={validateDescription(50, 2000, "remarks")}
        />
        <FileUpload
          name="workScreenShot"
          label="Work Screenshot"
          required
          placeholder="Work screenshot"
          accept=".pdf"
          maxPages={5}
          validatePDF={true}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5"
        >
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

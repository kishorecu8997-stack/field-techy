import { JOB_STATUSES, WORKING_TYPES } from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import type { JobHeaderCardProps } from "../types";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import Popup from "@/shared/components/Popup";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { icons } from "@/config/icons";

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
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={`${
        isSendProposal ? "text-gray-800 bg-yellow-50" : "bg-teal-800 text-white"
      } p-5 rounded-xl shadow-md`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900">
          {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
        <span className="flex items-center gap-1">🕒 {duration}</span>
        <span>Client: {client}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
        <span className="flex rounded-full text-sm font-medium h-fit justify-end items-end w-fit">
          {status === JOB_STATUSES.inprogress ? (
            <div className="flex flex-wrap gap-2 w-fit">
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-full font-medium border border-gray-300"
                onClick={() => setOpen(true)}
              >
                Upload Logs
              </Button>
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-full font-medium border border-gray-300"
                onClick={() => setIsWorkSubmitted?.(true)}
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
                  className="bg-teal-800 text-white px-6 py-2 rounded-full font-medium border border-gray-300"
                  onClick={() => setSendProposal?.(true)}
                >
                  Send Proposal
                </Button>
              ) : (
                <div
                  className="text-green-700 hover:underline cursor-pointer"
                  onClick={() => setSendProposal?.(false)}
                >
                  View Job posting
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
      <Popup open={open} onClose={() => setOpen(false)}>
        <UpdateStatus onClose={() => setOpen(false)} />
      </Popup>
    </div>
  );
};

export default JobHeaderCard;

const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const FormCtx = useForm();

  const handleSubmit = () => {
    console.log("Submitted");
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
        <InputField name="status" label="Status" required />
        <TextareaInput name="description" label="Description" required />
        <FileUpload name="file" label="Upload File" required />
        <Button className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5">
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

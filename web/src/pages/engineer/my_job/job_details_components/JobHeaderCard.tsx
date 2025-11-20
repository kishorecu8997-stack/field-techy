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

const JobHeaderCard: React.FC<JobHeaderCardProps> = ({
  title,
  client,
  duration,
  type,
  status = "new",
  setIsWorkSubmitted,
  setSendProposal,
  isSendProposal,
  setActiveTab,
  setOfferJobStatus,
  OfferJobStatus,
}) => {
  const [open, setOpen] = React.useState(false);

  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  return (
    <div
      className={`${
        isSendProposal ? "text-gray-800 bg-yellow-50" : "bg-teal-800 text-white"
      } p-5 rounded-xl shadow-md`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        <span className="bg-gray-300 px-3 py-1.5 rounded-full text-sm font-medium text-gray-900">
          {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1">🕒 {duration}</span>
        <span>Client: {client}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 justify-end">
        <span className="flex rounded-full text-sm font-medium">
          {status === JOB_STATUSES.inprogress ? (
            <div className="flex gap-2">
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-full"
                onClick={() => setOpen(true)}
              >
                Update Log
              </Button>
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-full"
                onClick={() => setIsWorkSubmitted?.(true)}
              >
                Submit work
              </Button>
            </div>
          ) : status === JOB_STATUSES.applied ? (
            <div className="flex gap-2 items-center">
              <icons.checkCircle className="text-green-500 w-6 h-6" />
              <span className="text-lg">Job Applied</span>
            </div>
          ) : status === JOB_STATUSES.new ? (
            <div className="flex gap-2 items-center">
              {!isSendProposal && (
                <>
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
                    onClick={() => setSendProposal?.(true)}
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
                    View Job posting
                  </Button>
                </>
              )}
            </div>
          ) : status === JOB_STATUSES.offer ? (
            <div className="flex gap-2 items-center">
              {OfferJobStatus === undefined ? (
                <div className="flex gap-4">
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
                    onClick={() => setOfferJobStatus("accepted")}
                  >
                    Accept Job
                  </Button>

                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
                    onClick={() => {
                      setOfferJobStatus("declined");
                      setActiveKey("cancelOffer");
                      setISOpenSidebar(true);
                    }}
                  >
                    Decline
                  </Button>
                </div>
              ) : OfferJobStatus === "accepted" ? (
                <div className="flex gap-4">
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
                    onClick={() => setOfferJobStatus("started")}
                  >
                    Start Job
                  </Button>

                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
                    onClick={() => {
                      setOfferJobStatus("declined");
                      setActiveKey("cancelOffer");
                      setISOpenSidebar(true);
                    }}
                  >
                    Decline
                  </Button>
                </div>
              ) : OfferJobStatus === "started" ? (
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md"
                  onClick={() => setOfferJobStatus("checked-in")}
                >
                  Check in
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
                    onClick={() => setOpen(true)}
                  >
                    Update Log
                  </Button>
                  <Button
                    className="bg-teal-800 text-white px-6 py-2 rounded-md"
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
            <div className="flex gap-2 items-center">
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

// -----------------------------------------------------
// Subcomponent
// -----------------------------------------------------

const UpdateStatus = ({ onClose }: { onClose: () => void }) => {
  const FormCtx = useForm();

  const handleSubmit = () => {
    toast.success("Job status updated successfully!");
  };

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-end">
        <button onClick={onClose}>
          <icons.close className="w-6 h-6" />
        </button>
      </div>

      <div className="text-xl font-bold text-center">Update Status</div>

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
          rules={validateDescription(5, 2000, "remarks")}
        />

        <FileUpload
          name="workScreenShot"
          label="Work Screenshot"
          required
          accept=".pdf"
        />

        <Button
          type="submit"
          className="w-full bg-teal-800 text-white py-2 rounded-lg mt-5"
        >
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

import { absoluteUrls } from "@/config/urls";
import {
  useEngineerApplyJob,
  useEngineerMarkProposalFileUploaded,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateDescription, validateNumericInput } from "../validation";
import { getUserId } from "@/utils";

export interface proposalTypes {
  description: string;
  expected: string;
  type: string;
  attachment: FileList | null;
  availability: string;
  question: string;
  describe: string;
}

/**
 * A form component for submitting a job proposal.
 *
 * This component renders a multi-field form that allows a user to:
 * - Provide a job description/pitch
 * - Specify expected pay and pay type (fixed or negotiable)
 * - Upload an attachment
 * - Indicate availability (in hours)
 * - Answer screening questions about their fit and relevant experience
 *
 * The form uses `react-hook-form` for validation and state management,
 * and is wrapped in a `FormContainer` that handles form submission.
 *
 * @component
 * @example
 * return <SendProposal />;
 */
interface SendProposalProps {
  jobId: number;
}

/**
 * A form component for submitting a job proposal.
 *
 * This component renders a multi-field form that allows a user to:
 * - Provide a job description/pitch
 * - Specify expected pay and pay type (fixed or negotiable)
 * - Upload an attachment
 * - Indicate availability (in hours)
 * - Answer screening questions about their fit and relevant experience
 *
 * The form uses `react-hook-form` for validation and state management,
 * and is wrapped in a `FormContainer` that handles form submission.
 *
 * @component
 * @example
 * return <SendProposal jobId={123} />;
 */
const SendProposal = ({ jobId }: SendProposalProps) => {
  const { showPopup } = usePopupStore();
  const userId = getUserId();

  const navigate = useNavigate();
  const formCtx = useForm<proposalTypes>({
    mode: "onChange",
    defaultValues: {
      description: "",
      expected: "",
      type: "",
      attachment: null,
      availability: "",
      question: "",
      describe: "",
    },
  });

  const { mutateAsync: applyJob } = useEngineerApplyJob();
  const { mutateAsync: markUploaded } = useEngineerMarkProposalFileUploaded();

  const handleSubmit = async (data: proposalTypes) => {
    if (!userId) {
      toast.error("Please login to submit a proposal");
      return;
    }

    await showPopup({
      title: "Submit Proposal",
      body: "Are you sure you want to submit the proposal?",
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "danger",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, submit",
          value: "ok",
          variant: "primary",
          action: async (close) => {
            try {
              const file = data.attachment?.[0];
              const proposalAttachmentMeta = file
                ? {
                    filename: file.name,
                    size: file.size,
                    mimeType: file.type,
                  }
                : undefined;

              // Append extra fields to description as they are not in new API
              const fullDescription = `${data.description}\n\nExpected Pay: ${data.expected} (${data.type})\nAvailability: ${data.availability}\n\nScreening Question: ${data.question}\nSimilar Project: ${data.describe}`;

              const response = await applyJob({
                body: {
                  jobId: Number(jobId),
                  proposalDetail: fullDescription,
                  proposalAttachment: proposalAttachmentMeta,
                },
              });

              if (file && response.uploadUrl) {
                // Upload file
                await fetch(response.uploadUrl, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-Type": file.type,
                  },
                });

                // Mark uploaded
                await markUploaded({
                  body: {
                    jobId: Number(jobId),
                    filename: file.name,
                    size: file.size,
                    mimeType: file.type,
                  } as any,
                });
              }

              toast.success("Proposal submitted successfully!");
              navigate(absoluteUrls.engineer.home.my_jobs);
              close(true);
            } catch (error) {
              console.error("Proposal submission failed:", error);
              toast.error("Failed to submit proposal. Please try again.");
              throw error;
            }
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col gap-1"
    >
      <TextareaInput
        name="description"
        label="Proposal Description"
        required
        placeholder="Write your pitch to the client here..."
        rules={validateDescription(50, 2000, "Proposal Description")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center items-center">
        <InputField
          name="expected"
          label="Expected Pay"
          placeholder="e.g 3000"
          required
          rules={validateNumericInput(3000, "Expected Pay")}
        />
        <SelectField
          name="type"
          label="Pay type"
          required
          options={[
            { value: "negotiable", label: "Negotiable" },
            { value: "fixed", label: "Fixed" },
          ]}
        />
      </div>
      <FileUpload
        name="attachment"
        label="Attachments"
        required
        accept=".pdf"
        maxPages={5}
        validatePDF={true}
      />
      <SelectField
        name="availability"
        label="Availability"
        required
        options={[
          { value: "1", label: "1 hour" },
          { value: "2", label: "2 hours" },
          { value: "3", label: "3 hours" },
        ]}
      />
      <hr className="my-3 text-gray-600" />
      <div className="font-bold text-2xl">Screening Questions</div>
      <TextareaInput
        name="question"
        label="Why do you think you're a good fit for this job?"
        placeholder="Write your pitch to the client here..."
        required
        rules={validateDescription(50, 2000, "Screening Questions")}
      />
      <TextareaInput
        name="describe"
        label="Describe a similar project you've worked on"
        placeholder="Write your pitch to the client here..."
        required
        rules={validateDescription(50, 2000, "Screening Questions")}
      />
      <Button
        type="submit"
        className="w-fit bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition mt-5"
      >
        Submit Proposal
      </Button>
    </FormContainer>
  );
};

export default SendProposal;

import { absoluteUrls } from "@/config/urls";
import {
  useEngineerFileUpload,
  useSendProposalJob,
} from "@/shared/apiServices/engineer/engineerService";
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
  attachment: File | null;
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
const SendProposal = () => {
  const { showPopup } = usePopupStore();
  const userId = getUserId();


  const navigate = useNavigate();
  const formCtx = useForm<proposalTypes>({
    mode: "onChange",
    defaultValues: {
      description: "Here we are using an attachment file. What should be the file type for this attachment",
      expected: "300",
      type: "",
      attachment: null,
      availability: "",
      question: "Here we are using an attachment file. What should be the file type for this attachment",
      describe: "Here we are using an attachment file. What should be the file type for this attachment",
    },
  });

  const file = formCtx.watch("attachment");
  console.log('file :', file);

  const { mutateAsync: uploadFile } = useEngineerFileUpload();
  const { mutateAsync: sendProposal } = useSendProposalJob({
    async onSuccess() {
      try {
        await uploadFile({
          engineerId: userId as string,
          file: file as File,
          documentType: "PROPOSAL",
        });
        toast.success("Proposal submitted successfully!");
        navigate(absoluteUrls.engineer.home.my_jobs);
      } catch (error) {
        console.error("Proposal submission failed:", error);
      }
    },
  });

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
          variant: "secondary",
          action: async (close) => {
            console.log("Cancel button clicked");
            close(true);
          },
        },
        {
          label: "Yes, submit",
          value: "ok",
          variant: "primary",
          action: async (close) => {
            console.log("OK button clicked");
            try {
              console.log("data :", data);
              await sendProposal({
                proposalDescription: data.description,
                expectedPay: data.expected,
                payType: data.type,
                engineerId: userId as string,
                availability: data.availability,
              });
              // Success flow handled in onSuccess
            } catch (error) {
              console.error("Proposal submission failed:", error);
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

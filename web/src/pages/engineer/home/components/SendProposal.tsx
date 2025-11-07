import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useForm } from "react-hook-form";
import { validateDescription, validateNumericInput } from "../validation";

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
  const formCtx = useForm();
  const handleSubmit = () => {
    console.log("Submitted");
  };

  return (
    <FormContainer methods={formCtx} onSubmit={handleSubmit}>
      <TextareaInput
        name="description"
        label="Job Description"
        required
        placeholder="Write your pitch to the client here..."
        rules={validateDescription(50, 2000, "Description")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
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
        rules={validateDescription(50, 2000, "question")}
      />
      <TextareaInput
        name="describe"
        label="Describe a similar project you've worked on"
        placeholder="Write your pitch to the client here..."
        required
        rules={validateDescription(50, 2000, "describe")}
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

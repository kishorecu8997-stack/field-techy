import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../../SectionHeader";
import { validateDescription } from "@/pages/engineer/home/validation";

/**
 * Job Details Section Component
 * This component renders the job details section of the job posting form.
 * @param {boolean} isDisable - A boolean flag to disable the form fields.
 * @returns {React.ReactElement} The rendered JobDetailsSection component.
 */
const JobDetailsSection = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div className="space-y-3">
      <SectionHeader title="Job Details" />
      <InputField
        name="jobTitle"
        label="Job Title"
        placeholder="Enter Job Title"
        required
        disabled={isDisable}
      />
      <TextareaInput
        name="description"
        label="Job Description"
        placeholder="Describe the role"
        required
        disabled={isDisable}
        rules={validateDescription(50, 2000, "Job Description")}
      />
    </div>
  );
};
export default JobDetailsSection;

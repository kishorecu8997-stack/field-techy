import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../../SectionHeader";

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
        rules={{
          required: "Job Title is required",
          validate: (value: string) => {
            if (!value) return "Job Title is required";
            // Check for leading or trailing spaces
            if (value !== value.trim()) {
              return "Job Title must not have leading or trailing spaces";
            }
            // Check for multiple consecutive spaces
            if (/\s{2,}/.test(value)) {
              return "Job Title must not have consecutive spaces";
            }
            if (value.length < 5) return "Job Title must be at least 5 characters";
            if (value.length > 100) return "Job Title must not exceed 100 characters";
            return true;
          },
        }}
      />
      <TextareaInput
        name="description"
        label="Job Description"
        placeholder="Describe the role"
        required
        disabled={isDisable}
        rules={{
          required: "Job Description is required",
          validate: (value: string) => {
            if (!value) return "Job Description is required";
            // Check for leading or trailing spaces
            if (value !== value.trim()) {
              return "Job Description must not have leading or trailing spaces";
            }
            // Check for multiple consecutive spaces
            if (/[^\S\r\n]{2,}/.test(value)) {
              return "Job Description must not have consecutive spaces";
            }
            if (value.length < 50) return "Job Description must be at least 50 characters";
            if (value.length > 2000) return "Job Description must not exceed 2000 characters";
            // Allow letters, numbers, spaces, and special characters / ( ) , . - #
            if (!/^[A-Za-z0-9\s\/(),.\-#]+$/.test(value)) {
              return "Only letters, numbers, spaces, and special characters / ( ) , . - # are allowed";
            }
            return true;
          },
        }}
      />
    </div>
  );
};
export default JobDetailsSection;


import { FileUpload, TextareaInput } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../../SectionHeader";

/**
 * Other Details Section Component
 * This component renders the other details section of the job posting form.
 * @param {Object} props - The props for the component.
 * @returns {React.ReactElement} The rendered OtherDetailsSection component.
 */
const OtherDetailsSection = ({ isDisable }: { isDisable: boolean }) => {
  return (
    <div className="space-y-3">
      <SectionHeader title="Other Details" />
      <div className="flex flex-col w-full gap-3">
        <TextareaInput
          name="otherInfo"
          label="Additional Details"
          placeholder="Add any additional guidelines or notes."
          disabled={isDisable}
          required
textareaClassName="w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition whitespace-pre-wrap resize-vertical min-h-[100px] bg-white dark:bg-gray-800 focus:ring-primary/40 focus:border-primary"
          rules={{
            required: "Additional Details is required",
            validate: (value: string) => {
              if (!value) return "Additional Details is required";
              // Check for leading or trailing spaces
              if (value !== value.trim()) {
                return "Additional Details must not have leading or trailing spaces";
              }
              // Check for multiple consecutive spaces
              if (/[^\S\r\n]{3,}/.test(value)) {
                return "Additional Details must not have excessive consecutive spaces";
              }
              if (value.length < 10) return "Must be at least 10 characters";
              if (value.length > 1000) return "Must not exceed 1000 characters";
              return true;
            }
          }}
        />
        <FileUpload
          name="attachment"
          label="Additional Attachments (Guidelines, Docs)"
          disabled={isDisable}
          required
        />
      </div>
    </div>
  );
};

export default OtherDetailsSection;


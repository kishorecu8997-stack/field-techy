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
          placeholder="Add any additional guidelines or notes"
          disabled={isDisable}
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

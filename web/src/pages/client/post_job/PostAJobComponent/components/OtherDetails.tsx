import {
  CheckboxInput,
  InputField,
  TextareaInput,
} from "@/shared/components/commonUI/inputs";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useFormContext } from "react-hook-form";
import SectionHeader from "../SectionHeader";
import { validateDescription } from "@/pages/engineer/home/validation";

const OtherDetails = ({ isDisable }: { isDisable: boolean }) => {
  const { currentLocation } = usePostAJobStore();
  const ctx = useFormContext();
  const WatchISTemplate = ctx.watch("saveAsTemplate");

  return (
    <div>
      <SectionHeader title="Other Details" />
      <TextareaInput
        label=" Additional Details"
        name="otherInfo"
        placeholder="Describe here..."
        required
        disabled={isDisable}
        rules={validateDescription(50, 2000, "Additional Details")}
      />
      <FileUpload
        name="attachment"
        label=" Additional Attachments (Guidelines, Docs)"
        placeholder="Attachments (Guidelines, Docs)"
        disabled={isDisable}
        accept=".pdf,.jpg,.png"
      />

      {currentLocation === CurrentLocation.dispatch && (
        <div className="w-full space-y-2">
          <CheckboxInput
            label="Save As Template"
            name="saveAsTemplate"
            disabled={isDisable}
          />
          {WatchISTemplate && (
            <InputField
              label="Template Name"
              name="templateName"
              placeholder="Enter Template Name"
              disabled={isDisable}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OtherDetails;

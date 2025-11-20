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

const OtherDetails = () => {
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
      />
      <FileUpload
        name="attachment"
        label=" Additional Attachments (Guidelines, Docs)"
      />

      {currentLocation === CurrentLocation.dispatch && (
        <div className="w-full space-y-2">
          <CheckboxInput label="Save As Template" name="saveAsTemplate" />
          {WatchISTemplate && (
            <InputField
              label="Template Name"
              name="templateName"
              placeholder="Enter Template Name"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OtherDetails;

import SectionHeader from "./SectionHeader";
import CheckboxSelector from "@/shared/components/DaySelector";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { validateDescription } from "@/utils/validate";
import { useFormContext } from "react-hook-form";

export default function ProjectJobSetting({ isDisable }: { isDisable: boolean }) {
  const methods = useFormContext();
  const businessHourFrom = methods.watch("businessHourFrom");
  const businessHourTo = methods.watch("businessHourTo");

  return (
    <div>
      <SectionHeader title="Job Setting" />
      <CheckboxSelector
        disabled={isDisable}
        name="jobType"
        label="Job Type"
        required
        options={["Full Time", "Part Time", "Contract", "All Time"]}
      />

      <div className="flex items-center gap-2">
        <CustomTimePicker
          name="businessHourFrom"
          required
          label="Business Hours (From)"
          maxTime={businessHourTo}
          disabled={isDisable}
        />

        <CustomTimePicker
          name="businessHourTo"
          required
          label="Business Hours (To)"
          minTime={businessHourFrom}
          disabled={isDisable}
        />
      </div>
      <TextareaInput
        name="description"
        label="Description"
        placeholder="Enter Description"
        required
        disabled={isDisable}
        rules={{ validate: (v: string) => validateDescription(v) }}
      />
    </div>
  );
}

import SectionHeader from "./SectionHeader";
import CheckboxSelector from "@/shared/components/CheckboxSelector";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { validateDescription } from "@/utils/validate";
import { useFormContext } from "react-hook-form";

/**
 * ProjectJobSetting
 *
 * Section of the create-project form that configures job-level settings such
 * as job type, business hours and a descriptive text for the job. It
 * integrates with `react-hook-form` via `useFormContext` and watches the
 * business hours (from/to) to provide min/max constraints on the time pickers.
 *
 * Props:
 * - `isDisable` (boolean): when true, all inputs in this section are disabled
 *   (typically used during review mode).
 *
 * Behavior:
 * - Renders a multi-option checkbox selector for `jobType`.
 * - Renders two `CustomTimePicker` controls for business hours with mutual
 *   min/max constraints derived from the form state.
 * - Renders a `TextareaInput` for the job description with validation.
 *
 * @component
 * @param {{ isDisable: boolean }} props
 * @returns {JSX.Element} Job settings form section
 */
export default function ProjectJobSetting({
  isDisable,
}: {
  isDisable: boolean;
}) {
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

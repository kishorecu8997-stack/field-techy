import SectionHeader from "./SectionHeader";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { useFormContext } from "react-hook-form";

/**
 * ProjectScheduling
 *
 * Form section that manages scheduling for a project. It exposes start and end
 * date pickers for scheduling and enforces min/max constraints so the selected
 * start date cannot be after the end date and vice versa.
 *
 * Props:
 * - `isDisable` (boolean): When true, the date inputs are disabled (used during review mode).
 *
 * Behavior:
 * - Watches `scheduledStartDate` and `scheduledEndDate` from form context to
 *   apply `minDate`/`maxDate` constraints on the date pickers.
 * - Integrates with `react-hook-form` via shared `DatePickerInput` components.
 *
 * @component
 * @param {{ isDisable: boolean }} props
 * @returns {JSX.Element} Scheduling section of the create-project form
 */
export default function ProjectScheduling({
  isDisable,
}: {
  isDisable: boolean;
}) {
  const methods = useFormContext();
  const scheduledStartDate = methods.watch("scheduledStartDate");
  const scheduledEndDate = methods.watch("scheduledEndDate");

  return (
    <div>
      <SectionHeader title="Scheduling" />
      <div className="flex gap-4">
        <DatePickerInput
          name="scheduledStartDate"
          disabled={isDisable}
          label="Scheduled Start Date"
          placeholder="Start Date"
          required
          maxDate={scheduledEndDate ? scheduledEndDate : null}
        />
        <DatePickerInput
          name="scheduledEndDate"
          disabled={isDisable}
          label="Scheduled End Date"
          placeholder="End Date"
          required
          minDate={scheduledStartDate ? scheduledStartDate : null}
        />
      </div>
    </div>
  );
}

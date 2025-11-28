import SectionHeader from "./SectionHeader";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { useFormContext } from "react-hook-form";

export default function ProjectScheduling() {
  const methods = useFormContext();
  const scheduledStartDate = methods.watch("scheduledStartDate");
  const scheduledEndDate = methods.watch("scheduledEndDate");

  return (
    <div>
      <SectionHeader title="Scheduling" />
      <div className="flex gap-4">
        <DatePickerInput
          name="scheduledStartDate"
          label="Scheduled Start Date"
          placeholder="Start Date"
          required
          minDate={scheduledEndDate ? scheduledEndDate : null}
          maxDate={scheduledEndDate ? scheduledEndDate : null}
        />
        <DatePickerInput
          name="scheduledEndDate"
          label="Scheduled End Date"
          placeholder="End Date"
          required
          minDate={scheduledStartDate ? scheduledStartDate : null}
          maxDate={scheduledStartDate ? scheduledStartDate : null}
        />
      </div>
    </div>
  );
}

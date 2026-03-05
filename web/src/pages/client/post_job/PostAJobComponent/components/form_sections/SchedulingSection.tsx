import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import SectionHeader from "../../SectionHeader";

/**
 * Scheduling Section Component
 * This component renders the scheduling section of the job posting form.
 * - Start Date: min = today, max = selected end date (cannot exceed end date)
 * - End Date: min = start date + 1 day (must be strictly after start date)
 * @param {Object} props - The props for the component.
 * @returns {React.ReactElement} The rendered SchedulingSection component.
 */
const SchedulingSection = ({ isDisable }: { isDisable: boolean }) => {
  const { watch } = useFormContext();
  const startDateValue = watch("startDate") as Date | null;
  const endDateValue = watch("endDate") as Date | null;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /** Earliest selectable end date: one day after start date */
  const endDateMin = useMemo(() => {
    if (!startDateValue) return today;
    const next = new Date(startDateValue);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next;
  }, [startDateValue, today]);

  /** Latest selectable start date: the currently selected end date */
  const startDateMax = useMemo(() => {
    if (!endDateValue) return undefined;
    const prev = new Date(endDateValue);
    prev.setDate(prev.getDate() - 1);
    prev.setHours(0, 0, 0, 0);
    return prev;
  }, [endDateValue]);

  return (
    <div className="space-y-3">
      <SectionHeader title="Scheduling" />
      <div className="flex flex-row w-full gap-4 items-center">
        <div className="w-1/2">
          <DatePickerInput
            label="Start Date"
            name="startDate"
            placeholder="Select Start Date"
            minDate={today}
            maxDate={startDateMax}
            required
            disabled={isDisable}
          />
        </div>
        <div className="w-1/2">
          <DatePickerInput
            label="End Date"
            name="endDate"
            placeholder="Select End Date"
            minDate={endDateMin}
            required={!!startDateValue}
            disabled={isDisable || !startDateValue}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulingSection;

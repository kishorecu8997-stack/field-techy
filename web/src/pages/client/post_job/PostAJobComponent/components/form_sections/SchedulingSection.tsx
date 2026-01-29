import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import SectionHeader from "../../SectionHeader";

/**
 * Scheduling Section Component
 * This component renders the scheduling section of the job posting form.
 * @param {Object} props - The props for the component.
 * @returns {React.ReactElement} The rendered SchedulingSection component.
 */
const SchedulingSection = ({ isDisable }: { isDisable: boolean }) => {
  const { watch } = useFormContext();
  const startDateValue = watch("startDate") as Date | null;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

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
            required
            disabled={isDisable}
          />
        </div>
        <div className="w-1/2">
          <DatePickerInput
            label="End Date"
            name="endDate"
            placeholder="Select End Date"
            minDate={startDateValue || today}
            required
            disabled={isDisable}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulingSection;

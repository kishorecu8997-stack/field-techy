import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import Popup from "@/shared/components/Popup";
import { validateDescription } from "@/utils/validate";
import React from "react";
import { useFormContext } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";

export default function SuspendEngineer({
  isSuspendengineer,
  setIsSuspendengineer,
}: {
  isSuspendengineer: boolean;
  setIsSuspendengineer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const ctx = useFormContext();
  const suspendStartDate = ctx.watch("suspendStartDate");
  const suspendEndDate = ctx.watch("suspendEndDate");
  return (
    <div>
      <Popup
        open={isSuspendengineer}
        onClose={() => setIsSuspendengineer(false)}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">Suspend Engineer</span>
            <div
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsSuspendengineer(false)}
            >
              <IoCloseSharp />
            </div>
          </div>

          <div className="my-4">
            <DatePickerInput
              name="suspendStartDate"
              label="Start Date"
              placeholder="Start Date"
              required
              maxDate={suspendEndDate || undefined}
            />
            <DatePickerInput
              name="suspendEndDate"
              label="End Date"
              placeholder="End Date"
              required
              minDate={suspendStartDate || undefined}
            />
            <TextareaInput
              name="reason"
              label="Reason for Suspension"
              placeholder="Reason"
              required
              rules={{ validate: (v: string) => validateDescription(v) }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSuspendengineer(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
}

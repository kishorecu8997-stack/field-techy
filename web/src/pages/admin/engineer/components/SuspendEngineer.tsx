import { Button } from "@/shared/components/commonUI/Buttons";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import Popup from "@/shared/components/Popup";
import { validateDescription } from "@/utils/validate";
import React from "react";
import { useFormContext, type SubmitHandler } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";

type SuspendEngineerForm = {
  suspendStartDate: Date
  suspendEndDate: Date
  reason: string
}

export default function SuspendEngineer({
  isSuspendEngineer,
  setIsSuspendEngineer,
}: {
  isSuspendEngineer: boolean;
  setIsSuspendEngineer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { watch, handleSubmit } = useFormContext<SuspendEngineerForm>(); 
  const suspendStartDate = watch("suspendStartDate");
  // This function only executes if validation passes
  const onSubmit: SubmitHandler<SuspendEngineerForm> = (data) => {
    // Add your API call logic here
    toast.success("Engineer suspended successfully!");
    setIsSuspendEngineer(false);
  };
  return (
    <div>
      <Popup
        open={isSuspendEngineer}
        onClose={() => setIsSuspendEngineer(false)}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">Suspend Engineer</span>
            <div
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsSuspendEngineer(false)}
            >
              <IoCloseSharp />
            </div>
          </div>

          <div className="my-4 flex flex-col gap-4">
            <DatePickerInput
              name="suspendStartDate"
              label="Start Date"
              placeholder="Start Date"
              required 
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
            />
            <DatePickerInput
              name="suspendEndDate"
              label="End Date"
              placeholder="End Date"
              required
              minDate={suspendStartDate}
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
              type="button"
              onClick={() => setIsSuspendEngineer(false)}
            >
              Cancel
            </Button>
            <Button
              type="button" 
              className="w-fit bg-teal-900 text-white"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
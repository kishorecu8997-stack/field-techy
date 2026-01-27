import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { validateEmail, validateName } from "@/utils/validate";
import { Controller, useFormContext } from "react-hook-form";
import SectionHeader from "../SectionHeader";
import { useEffect, useState } from "react";

/*
 *  Client Fields
 *    - Displays a form to add client details
 *    - Uses react-hook-form for form state management
 *    - Submits form data to the server
 * @returns {JSX.Element} The rendered Client Fields
 * @constructor
 *  */
const ClientFields = () => {
  const ctx = useFormContext();
  const startDate = ctx.watch("startDate");
  const [minStartTime, setMinStartTime] = useState<string | undefined>();

  useEffect(() => {
    if (!startDate) {
      setMinStartTime(undefined);
      return;
    }

    let selectedDate: Date;
    if (typeof startDate === "string") {
      const [year, month, day] = startDate.split("-").map(Number);
      selectedDate = new Date(year, month - 1, day);
    } else if (startDate instanceof Date) {
      selectedDate = new Date(startDate);
    } else {
      setMinStartTime(undefined);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      now.setSeconds(0, 0); // reset seconds and milliseconds
      now.setMinutes(now.getMinutes() + 1);

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setMinStartTime(`${hours}:${minutes}`);
    } else {
      setMinStartTime(undefined); // no restriction for future dates
    }
  }, [startDate]);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          <InputField
            label="First Name"
            name="firstName"
            required
            placeholder="first Name"
            rules={{ validate: (v) => validateName(v) }}
          />
          <InputField
            required
            label="Last Name"
            name="lastName"
            placeholder="last Name"
            rules={{ validate: (v) => validateName(v) }}
          />
          <InputField
            label="Email"
            required
            name="email"
            placeholder="Client Email"
            rules={{ validate: (v) => validateEmail(v) }}
          />
          <PhoneInputField name="mobile" label="Phone Number" required />
          <SectionHeader title=" Interview Schedule Info" />
          <div className="relative w-full">
            <Controller
              name="startDate"
              control={ctx.control}
              render={({ field }) => (
                <>
                  <DatePickerInput
                    label="Start Date"
                    placeholder="Select start date"
                    {...field}
                    minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                    required
                  />
                </>
              )}
            />
          </div>
          <div className="w-full">
            <CustomTimePicker
              label="Start Time"
              name="startTime"
              required
              minTime={minStartTime}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded w-full"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ClientFields;

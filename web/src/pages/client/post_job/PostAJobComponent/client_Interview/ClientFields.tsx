import { Button } from "@/shared/components/commonUI/Buttons";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import TimeInput from "@/shared/components/commonUI/inputs/TimeInput";
import { Controller, useFormContext } from "react-hook-form";
import SectionHeader from "../SectionHeader";

const ClientFields = () => {
  const ctx = useFormContext();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col overflow-auto flex-grow gap-2">
        <div className="">
          <InputField
            label="First Name"
            name="firstName"
            required
            placeholder="first Name"
          />
          <InputField
            required
            label="Last Name"
            name="lastName"
            placeholder="last Name"
          />
          <InputField
            label="Email"
            required
            name="email"
            placeholder="Client Email"
          />
          <InputField
            required
            label="Phone"
            name="mobile"
            placeholder="Client Phone"
          />
          <div className="py-2">
            <SectionHeader title=" Interview Schedule Info" />
          </div>
          <div className="flex flex-col w-full gap-2 items-center">
            <div className="relative w-full">
              <Controller
                name="startDate"
                control={ctx.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePickerInput
                      label="Start Date"
                      placeholder="Select start date"
                      {...field}
                      required
                    />
                    {error && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="w-full">
              <TimeInput label="Start Time" name="startTime" required />
            </div>
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

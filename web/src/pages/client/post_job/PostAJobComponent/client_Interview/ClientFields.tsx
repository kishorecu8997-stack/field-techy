import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { validateEmail, validateName } from "@/utils/validate";
import { Controller, useFormContext } from "react-hook-form";
import SectionHeader from "../SectionHeader";

const ClientFields = () => {
  const ctx = useFormContext();

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-col overflow-auto">
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
            <CustomTimePicker label="Start Time" name="startTime" required />
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

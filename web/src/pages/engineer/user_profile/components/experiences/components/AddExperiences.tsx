import React from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import {
  designationData,
  workLocationTypeData,
  employmentTypeData,
} from "@/dummy_data";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { validateCompany, validateDateRange } from "../../../Validate";
import type { ExperiencesFormData } from "./types";

/**
 * The AddExperiences component renders a form for adding a new work experience entry.
 * It uses `react-hook-form` for form management, validation, and submission.
 * @param {AddExperiencesProps} props - Component props.
 * @returns {React.ReactElement} The rendered AddExperiences form component.
 */
const AddExperiences = () => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the experience data.
   * @param {AddExperiencesFormData} data - The validated form data.
   */
  const handleSubmit = (data: ExperiencesFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: integrate submission logic here (e.g., API call)
    // Example: await api.experiences.create(data);
  };

  /**
   * Initializes `react-hook-form` with default values and sets the validation
   * mode to 'onChange' to provide immediate feedback to the user.
   */
  const methods = useForm<ExperiencesFormData>({
    defaultValues: {
      designation: "",
      employer: "",
      workLocationType: "",
      employmentType: "",
      startDate: null,
      endDate: null,
    },
    mode: "onSubmit",
  });

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <SelectField
          label="Designation"
          isShowLabel={false}
          name="designation"
          placeholder="Designation"
          options={designationData.map((e) => ({
            value: e.id,
            label: e.title,
          }))}
          required
        />
        <InputField
          label="Employer"
          isShowLabel={false}
          name="employer"
          placeholder="Employer"
          required
          rules={{ validate: (v: string) => validateCompany(v) }}
        />

        <SelectField
          label="Work Location Type"
          isShowLabel={false}
          name="workLocationType"
          placeholder="Work Location Type"
          options={workLocationTypeData.map((e) => ({
            value: e.id,
            label: e.type,
          }))}
          required
        />

        <SelectField
          label="Employment Type"
          isShowLabel={false}
          name="employmentType"
          placeholder="Employment Type"
          options={employmentTypeData.map((e) => ({
            value: e.id,
            label: e.type,
          }))}
          required
        />

        <Controller
          name="startDate"
          control={methods.control}
          rules={{
            validate: (value) =>
              validateDateRange(value, methods.getValues("endDate")),
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <DatePickerInput
                label="Start Date"
                isShowLabel={false}
                placeholder="Start date"
                value={field.value}
                onChange={field.onChange}
                minDate={new Date(1970, 0, 1)}
                maxDate={new Date()}
              />
              {error && <p className="text-red-600 text-sm">{error.message}</p>}
            </>
          )}
        />
        <Controller
          name="endDate"
          control={methods.control}
          render={({ field }) => (
            <DatePickerInput
              label="End Date"
              isShowLabel={false}
              placeholder="End date (optional)"
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
                methods.trigger("startDate"); // Re-validate start date
              }}
              minDate={methods.getValues("startDate") || new Date(1970, 0, 1)}
            />
          )}
        />
      </div>

      {/* Fixed bottom button */}
      <div className=" bg-white ">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Save
        </Button>
      </div>
    </FormContainer>
  );
};

export default AddExperiences;

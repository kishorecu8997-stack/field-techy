import React, { useEffect } from "react";
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
 * Props for the EditExperiences component.
 */
interface EditExperiencesProps {
  /** The experience data to pre-fill in the form for editing. */
  experienceData?: ExperiencesFormData;
}

/**
 * The EditExperiences component renders a form to modify an existing work experience.
 * It uses `react-hook-form` for management and validation, and is pre-populated
 * with the data passed via the `experienceData` prop.
 * @param {EditExperiencesProps} props - Component props.
 * @returns {React.ReactElement} The rendered EditExperiences form component.
 */
const EditExperiences: React.FC<EditExperiencesProps> = ({
  experienceData,
}) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to update the experience data.
   * @param {EditExperiencesFormData} data - The validated form data.
   */
  const handleSubmit = (data: ExperiencesFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: integrate submission logic here (e.g., API call)
    // Example: await api.experiences.update(experienceData.id, data);
  };

  /**
   * Initializes `react-hook-form` with default values for the experience form.
   * If `experienceData` is provided, it's used to pre-fill the form.
   */
  const methods = useForm<ExperiencesFormData>({
    defaultValues: experienceData || {
      designation: "",
      employer: "",
      workLocationType: "",
      employmentType: "",
      startDate: null,
      endDate: null,
    },
    mode: "onSubmit",
  });

  /**
   * Effect to reset the form values if the `experienceData` prop changes.
   * This ensures the form updates if the user selects a different experience
   * entry to edit without closing the drawer.
   */
  useEffect(() => {
    if (experienceData) {
      methods.reset(experienceData);
    }
  }, [experienceData, methods]);

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
      <div className="bg-white ">
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

export default EditExperiences;

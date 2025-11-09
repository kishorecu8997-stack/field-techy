import React, { useEffect } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { validateCompany, validateDateRange } from "../../../Validate";
import type { ExperiencesFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { designationOptions, employmentTypeOptions, workLocationTypeOptions } from "./constants";

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
          options={designationOptions.map((e) => ({
            value: e.id,
            label: e.title
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
          options={workLocationTypeOptions}
          required
        />

        <SelectField
          label="Employment Type"
          isShowLabel={false}
          name="employmentType"
          placeholder="Employment Type"
          options={employmentTypeOptions}
          required
        />
         <DatePickerInput
          name="startDate"
          label="Start Date"
          isShowLabel={false}
          placeholder="Start date"
          required
          maxDate={new Date()}
          rules={{
            validate: (value) =>
              validateDateRange(value, methods.getValues("endDate")),
          }}
        />
        <DatePickerInput
          name="endDate"
          label="End Date"
          isShowLabel={false}
          placeholder="End date (optional)"
          minDate={methods.watch("startDate") || new Date(1970, 0, 1)}
          rules={{ onChange: () => methods.trigger("startDate") }}
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

/**
 * @file EditExperiences.tsx
 * @description This component provides a form for users to edit an existing work experience.
 * It is designed to be displayed within a drawer, pre-populated with the data
 * of the experience entry being edited.
 */

import React, { useEffect } from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
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
import { validateDateRange } from "../../../Validate";

/**
 * Defines the shape of the form data for editing a work experience.
 * @typedef {Object} EditExperiencesFormData
 * @property {string} designation - The job title or designation.
 * @property {string} employer - The name of the employer.
 * @property {string} workLocationType - The type of work location (e.g., 'remote', 'office').
 * @property {string} employmentType - The type of employment (e.g., 'full-time', 'contract').
 * @property {Date | null} startDate - The start date of the employment.
 * @property {Date | null} endDate - The end date of the employment (optional).
 */
export type EditExperiencesFormData = {
  designation: string;
  employer: string;
  workLocationType: string;
  employmentType: string;
  startDate: Date | null;
  endDate: Date | null;
};

/**
 * Props for the EditExperiences component.
 */
interface EditExperiencesProps {
  /** The experience data to pre-fill in the form for editing. */
  experienceData?: EditExperiencesFormData;
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The EditExperiences component renders a form to modify an existing work experience.
 * It uses `react-hook-form` for management and validation, and is pre-populated
 * with the data passed via the `experienceData` prop.
 * @param {EditExperiencesProps} props - Component props.
 * @returns {React.ReactElement} The rendered EditExperiences form component.
 */
const EditExperiences: React.FC<EditExperiencesProps> = ({
  onClose,
  onMenuItemClick,
  experienceData,
}) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to update the experience data.
   * @param {EditExperiencesFormData} data - The validated form data.
   */
  const handleSubmit = (data: EditExperiencesFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: integrate submission logic here (e.g., API call)
    // Example: await api.experiences.update(experienceData.id, data);
  };

  /**
   * Initializes `react-hook-form` with default values for the experience form.
   * If `experienceData` is provided, it's used to pre-fill the form.
   */
  const methods = useForm<EditExperiencesFormData>({
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
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader
          title="Edit Experiences"
          onClose={onClose}
          onBack={() => onMenuItemClick("experiences")}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          <SelectField
            name="designation"
            placeholder="Designation"
            options={designationData.map((e) => ({
              value: e.id,
              label: e.title,
            }))}
            required
          />
          <InputField name="employer" placeholder="Employer" required />

          <SelectField
            name="workLocationType"
            placeholder="Work Location Type"
            options={workLocationTypeData.map((e) => ({
              value: e.id,
              label: e.type,
            }))}
            required
          />

          <SelectField
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
                  // label="Start Date"
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
                // label="End Date"
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
        <div className=" bottom-0  p-10 bg-white ">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default EditExperiences;

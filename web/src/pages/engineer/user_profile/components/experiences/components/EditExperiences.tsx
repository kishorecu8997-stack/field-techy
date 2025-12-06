import { experianceEdit } from "@/dummy_data/engineer_profile/work-experience";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCompany, validateDateRange } from "../../../Validate";
import {
  designationOptions,
  employmentTypeOptions,
  workLocationTypeOptions,
} from "./constants";
import type { ExperiencesFormData } from "./types";

/**
 * The EditExperiences component renders a form to modify an existing work experience.
 * It uses `react-hook-form` for management and validation, and is pre-populated
 * with the data passed via the `experienceData` prop.
 * @param {EditExperiencesProps} props - Component props.
 * @returns {React.ReactElement} The rendered EditExperiences form component.
 */
const EditExperiences = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const handleSubmit = async (data: ExperiencesFormData) => {
    await showPopup({
      title: "Update Experience",
      body: "Are you sure you want to update this experience?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Experience Updated Successfully");
            close(true);
            setActiveKey("experiences");
          },
        },
      ],
    });
  };

  const getExperienceById = () => {
    const id = localStorage.getItem("editExperiencesId");
    console.log(id);
    const experienceId = id;
    const found = experianceEdit.find((exp) => exp.id === experienceId);

    if (!found) return undefined;

    // Convert string dates to Date objects (handle empty/undefined endDate)
    return {
      ...found,
      startDate: found.startDate ? new Date(found.startDate) : undefined,
      endDate: found.endDate ? new Date(found.endDate) : undefined,
    };
  };

  const methods = useForm<ExperiencesFormData>({
    defaultValues: getExperienceById(),
    mode: "onSubmit",
  });

  useEffect(() => {
    // Clean up the ID from localStorage after the component has mounted
    // to prevent it from being used again accidentally.
    return () => {
      localStorage.removeItem("editExperiencesId");
    };
  }, []);

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
              validateDateRange(value, methods.getValues("endDate") || null),
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

import React, { useEffect } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * Defines the shape of the form data for editing skills.
 * @typedef {Object} EditSkillsFormData
 * @property {string[]} skills - An array of selected skill IDs.
 */
export type EditSkillsFormData = {
  skills: string[];
};

/**
 * Props for the EditSkills component.
 */
interface EditSkillsProps {
  /** An array of the user's current skill IDs to pre-populate the form. */
  currentSkills?: string[];
}

/**
 * The EditSkills component renders a form to modify a user's professional skills.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing skills.
 * @param {EditSkillsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditSkills form component.
 */
const EditSkills: React.FC<EditSkillsProps> = ({ currentSkills }) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to update the user's skills.
   * @param {EditSkillsFormData} data - The validated form data.
   */
  const onSubmit = (data: EditSkillsFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form` and sets default values from the `currentSkills` prop.
   */
  const methods = useForm<EditSkillsFormData>({
    defaultValues: { skills: currentSkills || [] },
  });

  /**
   * Effect to reset the form values if the `currentSkills` prop changes.
   * This ensures the form updates correctly if the underlying data changes
   * while the component is mounted.
   */
  useEffect(() => {
    methods.reset({ skills: currentSkills || [] });
  }, [currentSkills, methods]);

  /**
   * Transforms the raw skills data into a format suitable for the `TagSelectField` component.
   * @type {Array<{label: string, value: string}>}
   */
  const skillOptions = skillsData.map((skill) => ({
    label: skill.label,
    value: skill.id.toString(),
  }));

  return (
    <FormContainer
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <TagSelectField
          name="skills"
          label="Skills"
          isShowLabel={false}
          placeholder="Select Skill Name"
          required
          options={skillOptions}
          maxTags={15}
        />
      </div>

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

export default EditSkills;

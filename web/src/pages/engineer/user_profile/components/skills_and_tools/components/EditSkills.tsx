/**
 * @file EditSkills.tsx
 * @description This component provides a form for users to edit their professional skills.
 * It features a multi-select input field pre-populated with the user's current skills,
 * allowing them to add or remove selections.
 */

import React, { useEffect } from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummyData";

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
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The EditSkills component renders a form to modify a user's professional skills.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing skills.
 * @param {EditSkillsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditSkills form component.
 */
const EditSkills: React.FC<EditSkillsProps> = ({ onClose, onMenuItemClick, currentSkills }) => {
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
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader
          title="Edit Skills"
          onClose={onClose}
          onBack={() => onMenuItemClick("skillsAndTools")}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Skills Multi-Select */}
          <TagSelectField
            name="skills"
            label="Skills"
            placeholder="Select Skill Name"
            required
            options={skillOptions}
            maxTags={10}
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

export default EditSkills;

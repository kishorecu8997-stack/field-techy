/**
 * @file AddSkills.tsx
 * @description This component provides a form for users to add their professional skills.
 * It features a multi-select input field that allows users to choose from a predefined
 * list of skills. The component is designed to be displayed within a drawer or modal.
 */

import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummyData";


/**
 * Defines the shape of the form data for adding skills.
 * @typedef {Object} AddSkillsFormData
 * @property {string[]} skills - An array of selected skill IDs.
 */
export type AddSkillsFormData = {
  skills: string[];
};

/**
 * Props for the AddSkills component, used for navigation and closing the drawer.
 */
interface AddSkillsProps {
  /** Callback to navigate to a different view within the drawer. */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the parent drawer or sidebar. */
  onClose: () => void;
}

/**
 * The AddSkills component renders a form for adding new professional skills.
 * It uses `react-hook-form` for form management and a `TagSelectField` for multi-selection.
 * @param {AddSkillsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered AddSkills form component.
 */
const AddSkills: React.FC<AddSkillsProps> = ({ onClose, onMenuItemClick }) => {
  /**
   * Initializes `react-hook-form` with default values for the skills form.
   */
  const methods = useForm<AddSkillsFormData>({
    defaultValues: {
      skills: [],
    },
  });

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the selected skills.
   * @param {AddSkillsFormData} data - The validated form data containing an array of skill IDs.
   */
  const onSubmit = (data: AddSkillsFormData) => {
    console.log("Form data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

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
          title="Add Skills"
          onClose={onClose}
          onBack={() => onMenuItemClick("skillsAndTools")}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Skills Multi-Select */}
          <TagSelectField
            name="skills"            
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

export default AddSkills;

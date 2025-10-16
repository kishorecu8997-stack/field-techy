/**
 * @file EditTools.tsx
 * @description This component provides a form for users to edit their familiar tools.
 * It features a multi-select input field pre-populated with the user's current tools,
 * allowing them to add or remove selections.
 */

import React, { useEffect } from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { addEditToolsData } from "@/dummy_data";

/**
 * Defines the shape of the form data for editing tools.
 * @typedef {Object} EditToolsFormData
 * @property {string[]} tools - An array of selected tool IDs.
 */
export type EditToolsFormData = {
  tools: string[];
};

/**
 * Props for the EditTools component.
 */
interface EditToolsProps {
  /** An array of the user's current tool IDs to pre-populate the form. */
  currentTools?: string[];
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The EditTools component renders a form to modify a user's professional tools.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing tools.
 * @param {EditToolsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditTools form component.
 */
const EditTools: React.FC<EditToolsProps> = ({ onClose, onMenuItemClick, currentTools }) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to update the user's tools.
   * @param {EditToolsFormData} data - The validated form data.
   */
  const onSubmit = (data: EditToolsFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form` and sets default values from the `currentTools` prop.
   */
  const methods = useForm<EditToolsFormData>({
    defaultValues: { tools: currentTools || [] },
  });

  /**
   * Effect to reset the form values if the `currentTools` prop changes.
   * This ensures the form updates correctly if the underlying data changes
   * while the component is mounted.
   */
  useEffect(() => {
    methods.reset({ tools: currentTools || [] });
  }, [currentTools, methods]);

  /**
   * Transforms the raw tools data into a format suitable for the `TagSelectField` component.
   * @type {Array<{label: string, value: string}>}
   */
  const toolOptions = addEditToolsData.map((tool) => ({
    label: tool.label,
    value: tool.id.toString(),
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
          title="Edit Tools"
          onClose={onClose}
          onBack={() => onMenuItemClick("skillsAndTools")}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Tools Multi-Select */}
          <TagSelectField
            name="tools"
            label="Tools"
            placeholder="Select Tool Name"
            required
            options={toolOptions}
            maxTags={15}
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

export default EditTools;

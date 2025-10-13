/**
 * @file AddTools.tsx
 * @description This component provides a form for users to add their familiar tools.
 * It features a multi-select input field that allows users to choose from a predefined
 * list of tools. The component is designed to be displayed within a drawer or modal.
 */

import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { addEditToolsData } from "@/dummyData";


/**
 * Defines the shape of the form data for adding tools.
 * @typedef {Object} AddToolsFormData
 * @property {string[]} tools - An array of selected tool IDs.
 */
export type AddToolsFormData = {
  tools: string[];
};

/**
 * Props for the AddTools component, used for navigation and closing the drawer.
 */
interface AddToolsProps {
  /** Callback to navigate to a different view within the drawer. */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the parent drawer or sidebar. */
  onClose: () => void;
}

/**
 * The AddTools component renders a form for adding new professional tools.
 * It uses `react-hook-form` for form management and a `TagSelectField` for multi-selection.
 * @param {AddToolsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered AddTools form component.
 */
const AddTools: React.FC<AddToolsProps> = ({ onClose, onMenuItemClick }) => {
  /**
   * Initializes `react-hook-form` with default values for the tools form.
   */
  const methods = useForm<AddToolsFormData>({
    defaultValues: {
      tools: [],
    },
  });

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the selected tools.
   * @param {AddToolsFormData} data - The validated form data containing an array of tool IDs.
   */
  const onSubmit = (data: AddToolsFormData) => {
    console.log("Form data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Transforms the raw tools data into a format suitable for the `TagSelectField` component.
   * @type {Array<{label: string, value: string}>}
   */
  const toolOptions = addEditToolsData.map((tool) => ({
    label: tool.label ,
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
          title="Add Tools"
          onClose={onClose}
          onBack={() => onMenuItemClick("skillsAndTools")}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Skills Multi-Select */}
          <TagSelectField
            name="tools"
            placeholder="Select Tool Name"
            required
            options={toolOptions}
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

export default AddTools;

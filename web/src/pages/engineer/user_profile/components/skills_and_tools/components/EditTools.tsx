import React, { useEffect } from "react";
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
}

/**
 * The EditTools component renders a form to modify a user's professional tools.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing tools.
 * @param {EditToolsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditTools form component.
 */
const EditTools: React.FC<EditToolsProps> = ({ currentTools }) => {
  const onSubmit = (data: EditToolsFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  const methods = useForm<EditToolsFormData>({
    defaultValues: { tools: currentTools || [] },
  });
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
    <FormContainer
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <TagSelectField
          name="tools"
          label="Tools"
          isShowLabel={false}
          placeholder="Select Tool Name"
          required
          options={toolOptions}
          maxTags={15}
        />
      </div>

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

export default EditTools;

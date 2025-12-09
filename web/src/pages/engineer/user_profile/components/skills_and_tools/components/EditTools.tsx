import React, { useEffect, useMemo } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { addEditToolsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Defines the shape of the form data for editing tools.
 * @typedef {Object} EditToolsFormData
 * @property {string[]} tools - An array of selected tool IDs.
 */
export type EditToolsFormData = {
  tools: string[];
};

interface EditToolsProps {
  currentTools?: string[];
}

/**
 * The EditTools component renders a form to modify a user's professional tools.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing tools.
 * @param {EditToolsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditTools form component.
 */
const EditTools: React.FC<EditToolsProps> = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const initialToolIds = useMemo(() => {
    const storedIds = localStorage.getItem("editToolsId");
    if (storedIds) {
      try {
        const parsedIds: (string | number)[] = JSON.parse(storedIds);
        // Ensure all IDs are strings for the form field
        return parsedIds.map(String);
      } catch (error) {
        console.error("Failed to parse tool IDs from localStorage", error);
        return [];
      }
    }
    return [];
  }, []);

  const onSubmit = async (data: EditToolsFormData) => {
    await showPopup({
      title: "Update Tools",
      body: "Are you sure you want to update these tools?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Tools Updated Successfully");
            close(true);
            setActiveKey("skillsAndTools");
          },
        },
      ],
    });
  };

  const methods = useForm<EditToolsFormData>({
    defaultValues: { tools: initialToolIds },
  });

  /**
   * Cleanup localStorage on component unmount.
   */
  useEffect(() => {
    return () => {
      localStorage.removeItem("editToolsId");
    };
  }, []);

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

import { useEffect, useMemo } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { addEditToolsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import {
  useEngineerGetById,
  useEngineerUpdateById,
} from "@/shared/apiServices/engineer/engineerService";
import type { EngineerData } from "@/shared/apiServices/engineer/engineerTypes";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * Defines the shape of the form data for editing tools.
 * @typedef {Object} EditToolsFormData
 * @property {string[]} tools - An array of selected tool IDs.
 */
export type EditToolsFormData = {
  tools: string[];
};
/**
 * The EditTools component renders a form to modify a user's professional tools.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing tools.
 * @param {EditToolsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditTools form component.
 */
const EditTools = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const { session } = useUserSessionStore();
  const engineerId = session?.userId || "";

  const { data: engineerData, isLoading: isEngineerLoading } =
    useEngineerGetById(engineerId);
  const { mutate } = useEngineerUpdateById(engineerId);

  const initialToolIds = useMemo(() => {
    const storedIds = localStorage.getItem("editToolsId");
    if (storedIds) {
      try {
        const parsedIds: (string | number)[] = JSON.parse(storedIds);
        return parsedIds.map(String);
      } catch (error) {
        console.error("Failed to parse tool IDs from localStorage", error);
        return engineerData?.tools?.map(String) || [];
      }
    }
    return engineerData?.tools?.map(String) || [];
  }, [engineerData]);

  const methods = useForm<EditToolsFormData>({
    defaultValues: {
      tools: initialToolIds,
    },
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("editToolsId");
    };
  }, []);

  const toolOptions = addEditToolsData.map((tool) => ({
    label: tool.label,
    value: tool.id.toString(),
  }));

  const onSubmit = async (formData: EditToolsFormData) => {
    if (!engineerData) {
      toast.error("Unable to load current profile data. Please try again.");
      return;
    }

    const updatedEngineer: EngineerData = {
      ...engineerData,
      tools: formData.tools,
    };

    await showPopup({
      title: "Update Tools",
      body: "Are you sure you want to update these tools?",
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
            mutate(updatedEngineer, {
              onSuccess: () => {
                toast.success("Tools Updated Successfully");
                close(true);
                setActiveKey("skillsAndTools");
              },
              onError: (error) => {
                console.error("Failed to update tools:", error);
                toast.error("Failed to save tools. Please try again.");
                close(true);
              },
            });
          },
        },
      ],
    });
  };

  if (isEngineerLoading) {
    return <LoaderComponent />;
  }

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

      <div className="bg-white">
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

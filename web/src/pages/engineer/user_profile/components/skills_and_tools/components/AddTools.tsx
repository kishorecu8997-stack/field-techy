import { addEditToolsData } from "@/dummy_data";
import {
  useEngineerGetById,
  useEngineerUpdateById,
} from "@/shared/apiServices/engineer/engineerService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { EngineerData } from "@/shared/apiServices/engineer/engineerTypes";

/**
 * Form data shape for adding tools
 */
export type AddToolsFormData = {
  tools: string[];
};

/**
 * AddTools component - allows selecting and saving professional tools
 */
const AddTools = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const { session } = useUserSessionStore();
  const engineerId = session?.userId || "";

  const { data: engineerData, isLoading: isEngineerLoading } = useEngineerGetById(engineerId);
  const { mutate } = useEngineerUpdateById(engineerId);

  const methods = useForm<AddToolsFormData>({
    defaultValues: {
      tools: engineerData?.tools || [], // Pre-fill with existing tools
    },
  });

  const onSubmit = async (formData: AddToolsFormData) => {
    // Safety check
    if (!engineerData) {
      toast.error("Unable to load current profile data. Please try again.");
      return;
    }

    // Create full updated engineer object (required for reliable PUT behavior)
    const updatedEngineer: EngineerData = {
      ...engineerData,              // Keep all existing fields
      tools: formData.tools,        // Override only tools
    };

    await showPopup({
      title: "Add Tools",
      body: "Are you sure you want to add these tools?",
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
          label: "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            mutate(updatedEngineer, {
              onSuccess: () => {
                toast.success("Tools Added Successfully");
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

  const toolOptions = addEditToolsData.map((tool) => ({
    label: tool.label,
    value: tool.id.toString(),
  }));

  // Show loading while fetching current engineer data
  if (isEngineerLoading) {
    return <div>Loading profile data...</div>;
  }

  return (
    <FormContainer
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <TagSelectField
          label="Tools"
          isShowLabel={false}
          name="tools"
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

export default AddTools;
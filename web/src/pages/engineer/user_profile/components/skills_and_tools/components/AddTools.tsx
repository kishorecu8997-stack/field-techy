import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useEngineerGetSkillsAndTools,
  useEngineerUpdateSkillsAndTools,
  useLookupData
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

export type AddToolsFormData = {
  tools: string[];
};

const AddTools = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const { data: currentSkillsAndTools, isLoading: isCurrentLoading } = useEngineerGetSkillsAndTools();
  const { mutateAsync: updateSkillsAndTools } = useEngineerUpdateSkillsAndTools();
  const { data: toolsLookup } = useLookupData("tools" as any);

  const methods = useForm<AddToolsFormData>({
    defaultValues: {
      tools: [],
    },
  });

  const onSubmit = async (data: AddToolsFormData) => {
    await showPopup({
      title: "Add Tools",
      body: "Are you sure you want to add these tools?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => close(true),
        },
        {
          label: "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            const skillIds = currentSkillsAndTools?.skills.map(s => s.id) || [];
            const existingToolIds = currentSkillsAndTools?.tools.map(t => t.id) || [];
            const newToolIds = data.tools.map(Number);
            const combinedToolIds = Array.from(new Set([...existingToolIds, ...newToolIds]));

            try {
              await updateSkillsAndTools({
                skills: skillIds,
                tools: combinedToolIds
              });
              toast.success("Tools Added Successfully");
              close(true);
              setActiveKey("skillsAndTools");
            } catch (error) {
              console.error("Failed to add tools:", error);
              toast.error("Failed to add tools. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

  const toolOptions = toolsLookup?.map((tool: any) => ({
    label: tool.name,
    value: tool.id.toString(),
  })) || [];

  if (isCurrentLoading) return <LoaderComponent />;

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

export default AddTools;

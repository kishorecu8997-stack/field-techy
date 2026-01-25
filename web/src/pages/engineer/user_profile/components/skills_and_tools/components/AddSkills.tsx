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
import { useEngineerStore } from "@/shared/store/useEngineerStore";

export type AddSkillsFormData = {
  skills: string[];
};

const AddSkills = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const { data: currentSkillsAndTools, isLoading: isCurrentLoading } = useEngineerGetSkillsAndTools();
  const { mutateAsync: updateSkillsAndTools } = useEngineerUpdateSkillsAndTools();
  const { data: skillsLookup } = useLookupData("skills" as any);
  const { refetchProfile } = useEngineerStore();

  const methods = useForm<AddSkillsFormData>({
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = async (data: AddSkillsFormData) => {
    await showPopup({
      title: "Add Skills",
      body: "Are you sure you want to add these skills?",
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
            const existingSkillIds = currentSkillsAndTools?.skills.map(s => s.id) || [];
            const newSkillIds = data.skills.map(Number);
            const combinedSkillIds = Array.from(new Set([...existingSkillIds, ...newSkillIds]));
            const toolIds = currentSkillsAndTools?.tools.map(t => t.id) || [];

            try {
              await updateSkillsAndTools({
                body: {
                  skills: combinedSkillIds,
                  tools: toolIds
                }
              });
              toast.success("Skills Added Successfully");
              await refetchProfile();
              close(true);
              setActiveKey("skillsAndTools");
            } catch (error) {
              console.error("Failed to add skills:", error);
              toast.error("Failed to add skills. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

  // Filter out skills that are already added to the profile
  const existingSkillIds = currentSkillsAndTools?.skills.map((s) => s.id) || [];

  const skillOptions = skillsLookup
    ?.filter((skill: any) => !existingSkillIds.includes(skill.id))
    .map((skill: any) => ({
      label: skill.name,
      value: skill.id.toString(),
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
          label="Skills"
          isShowLabel={false}
          name="skills"
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

export default AddSkills;

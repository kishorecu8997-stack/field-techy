import { useEffect } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import {
  useEngineerGetSkillsAndTools,
  useEngineerUpdateSkillsAndTools,
  useLookupData
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

export type EditSkillsFormData = {
  skills: string[];
};

const EditSkills = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const { data: currentSkillsAndTools, isLoading: isCurrentLoading } = useEngineerGetSkillsAndTools();
  const { mutateAsync: updateSkillsAndTools } = useEngineerUpdateSkillsAndTools();
  const { data: skillsLookup } = useLookupData("skills" as any);

  const methods = useForm<EditSkillsFormData>({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (currentSkillsAndTools) {
      methods.reset({
        skills: currentSkillsAndTools.skills.map(s => s.id.toString()),
      });
    }
  }, [currentSkillsAndTools, methods]);

  const onSubmit = async (formData: EditSkillsFormData) => {
    await showPopup({
      title: "Update Skills",
      body: "Are you sure you want to update these skills?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "danger",
          action: async (close) => close(true),
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            const skillIds = formData.skills.map(Number);
            const toolIds = currentSkillsAndTools?.tools.map(t => t.id) || [];

            try {
              await updateSkillsAndTools({
                body: {
                  skills: skillIds,
                  tools: toolIds
                }
              });
              toast.success("Skills Updated Successfully");
              close(true);
              setActiveKey("skillsAndTools");
            } catch (error) {
              console.error("Failed to update skills:", error);
              toast.error("Failed to save skills. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

  const skillOptions = skillsLookup?.map((skill: any) => ({
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
          name="skills"
          label="Skills"
          isShowLabel={false}
          placeholder="Select Skill Name"
          required
          options={skillOptions}
          maxTags={15}
        />
      </div>

      <div className="bg-white">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition rounded-none"
        >
          Save
        </Button>
      </div>
    </FormContainer>
  );
};

export default EditSkills;

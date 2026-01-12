import { useEffect, useMemo } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummy_data";
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

export type EditSkillsFormData = {
  skills: string[];
};
/**
 * The EditSkills component renders a form to modify a user's professional skills.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing skills
 * retrieved from localStorage.
 * @param {EditSkillsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditSkills form component.
 */
const EditSkills = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const { session } = useUserSessionStore();
  const engineerId = session?.userId || "";

  const { data: engineerData, isLoading: isEngineerLoading } =
    useEngineerGetById(engineerId);
  const { mutate } = useEngineerUpdateById(engineerId);

  const initialSkillIds = useMemo(() => {
    const storedIds = localStorage.getItem("editSkillsId");
    if (storedIds) {
      try {
        const parsedIds: (string | number)[] = JSON.parse(storedIds);
        return parsedIds.map(String);
      } catch (error) {
        console.error("Failed to parse skill IDs from localStorage", error);
        return engineerData?.jobSkills?.map(String) || [];
      }
    }
    return engineerData?.jobSkills?.map(String) || [];
  }, [engineerData]);

  const skillOptions = skillsData.map((skill) => ({
    label: skill.label,
    value: skill.id.toString(),
  }));

  const methods = useForm<EditSkillsFormData>({
    defaultValues: {
      skills: initialSkillIds,
    },
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("editSkillsId");
    };
  }, []);
  /**
   * Handles the form submission for updating skills.
   * Currently logs the data to the console and shows a success toast.
   *
   * @param {EditSkillsFormData} data - The validated form data containing the updated list of skill IDs.
   */
  const onSubmit = async (formData: EditSkillsFormData) => {
    if (!engineerData) {
      toast.error("Unable to load current profile data. Please try again.");
      return;
    }

    const updatedEngineer: EngineerData = {
      ...engineerData,
      jobSkills: formData.skills,
    };

    await showPopup({
      title: "Update Skills",
      body: "Are you sure you want to update these skills?",
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
                toast.success("Skills Updated Successfully");
                close(true);
                setActiveKey("skillsAndTools");
              },
              onError: (error) => {
                console.error("Failed to update skills:", error);
                toast.error("Failed to save skills. Please try again.");
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
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Save
        </Button>
      </div>
    </FormContainer>
  );
};

export default EditSkills;

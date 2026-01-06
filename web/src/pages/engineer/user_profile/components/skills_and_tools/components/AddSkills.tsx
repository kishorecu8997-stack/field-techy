import { skillsData } from "@/dummy_data";
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
import type { EngineerData } from "@/shared/apiServices/engineer/engineerTypes"; // Make sure this import exists

/**
 * Defines the shape of the form data for adding skills.
 *  * @typedef {Object} AddSkillsFormData
 * @property {string[]} skills - An array of selected skill IDs.
 */
export type AddSkillsFormData = {
  skills: string[];
};

/**
 * The AddSkills component renders a form for adding new professional skills.
 * It uses `react-hook-form` for form management and a `TagSelectField` for multi-selection.
 *  
 * @returns {React.ReactElement} The rendered AddSkills form component.
 */
const AddSkills = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const { session } = useUserSessionStore();
  const engineerId = session?.userId || "";

  const { data: engineerData, isLoading: isEngineerLoading } = useEngineerGetById(engineerId);
  const { mutate } = useEngineerUpdateById(engineerId);

  const methods = useForm<AddSkillsFormData>({
    defaultValues: {
      skills: engineerData?.jobSkills || [], // Pre-fill with existing skills
    },
  });

  const onSubmit = async (formData: AddSkillsFormData) => {
    // Safety check: wait for engineer data to be available
    if (!engineerData) {
      toast.error("Unable to load current profile data. Please try again.");
      return;
    }

    // Create the full updated engineer object (important for PUT)
    const updatedEngineer: EngineerData = {
      ...engineerData,                    // Keep ALL existing fields
      jobSkills: formData.skills,         // Override only jobSkills
    };

    await showPopup({
      title: "Add Skills",
      body: "Are you sure you want to add these skills?",
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
                toast.success("Skills Added Successfully");
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

  const skillOptions = skillsData.map((skill) => ({
    label: skill.label,
    value: skill.id.toString(),
  }));

  // Optional: show loading state while fetching engineer data
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
          label="Skills"
          isShowLabel={false}
          name="skills"
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

export default AddSkills;
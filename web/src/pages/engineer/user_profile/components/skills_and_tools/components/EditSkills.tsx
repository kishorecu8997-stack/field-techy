import React, { useEffect, useMemo } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";

interface EditSkillsProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}

export type EditSkillsFormData = {
  skills: string[];
};
interface EditSkillsProps {
  currentSkills?: string[];
}

/**
 * The EditSkills component renders a form to modify a user's professional skills.
 * It uses `react-hook-form` and pre-populates the `TagSelectField` with existing skills
 * retrieved from localStorage.
 * @param {EditSkillsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditSkills form component.
 */
// const EditSkills: React.FC<EditSkillsProps> = () => {
  const EditSkills: React.FC<EditSkillsProps> = ({onMenuItemClick,onClose}) => {
  const initialSkillIds = useMemo(() => {
    const storedIds = localStorage.getItem("editSkillsId");
    if (storedIds) {
      try {
        const parsedIds: (string | number)[] = JSON.parse(storedIds);
        // Ensure all IDs are strings for the form field
        return parsedIds.map(String);
      } catch (error) {
        console.error("Failed to parse skill IDs from localStorage", error);
        return [];
      }
    }
    return [];
  }, []);
  /**
   * Transforms skillsData into select options.
   */
  const skillOptions = skillsData.map((skill) => ({
    label: skill.label,
    value: skill.id.toString(), // assuming skill.id is number
  }));

  /**
   * Initializes `react-hook-form` with default values for the edit skills form.
   */
  const methods = useForm<EditSkillsFormData>({
    defaultValues: {
      skills: initialSkillIds,
    },
  });

  /**
   * Effect hook to clean up the `editSkillsId` from localStorage when the component unmounts.
   */
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
  const onSubmit = (data: EditSkillsFormData) => {
    console.log("Form submitted with updated data:", data);
    toast.success("Skills Updated Successfully");
    onMenuItemClick("skillsAndTools")
    // TODO: API call
  };

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
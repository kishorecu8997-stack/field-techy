import React, { useEffect, useMemo } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";

export type EditSkillsFormData = {
  skills: string[]; // array of skill IDs (as strings)
};

interface EditSkillsProps {
  // This prop is not currently used as we are reading from localStorage,
  // but it's good practice for component design.
  currentSkills?: string[];
}

const EditSkills: React.FC<EditSkillsProps> = () => {
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

  const methods = useForm<EditSkillsFormData>({
    defaultValues: {
      skills: initialSkillIds,
    },
  });

  /**
   * Cleanup localStorage (if used elsewhere, but not for form values).
   */
  useEffect(() => {
    return () => {
      localStorage.removeItem("editSkillsId");
    };
  }, []);

  const onSubmit = (data: EditSkillsFormData) => {
    console.log("Form submitted with updated data:", data);
    toast.success("Skills Updated Successfully");
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
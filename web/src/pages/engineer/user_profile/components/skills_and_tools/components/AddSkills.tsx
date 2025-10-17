import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * Defines the shape of the form data for adding skills.
 * @typedef {Object} AddSkillsFormData
 * @property {string[]} skills - An array of selected skill IDs.
 */
export type AddSkillsFormData = {
  skills: string[];
};

const AddSkills = () => {
  /**
   * Initializes `react-hook-form` with default values for the skills form.
   */
  const methods = useForm<AddSkillsFormData>({
    defaultValues: {
      skills: [],
    },
  });

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the selected skills.
   * @param {AddSkillsFormData} data - The validated form data containing an array of skill IDs.
   */
  const onSubmit = (data: AddSkillsFormData) => {
    console.log("Form data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Transforms the raw skills data into a format suitable for the `TagSelectField` component.
   * @type {Array<{label: string, value: string}>}
   */
  const skillOptions = skillsData.map((skill) => ({
    label: skill.label,
    value: skill.id.toString(),
  }));

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

import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { skillsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";

interface AddSkillsProps {
  onMenuItemClick: (key: string) => void;
}
/**
 * Defines the shape of the form data for adding skills.
 * @typedef {Object} AddSkillsFormData
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

const AddSkills: React.FC<AddSkillsProps> = ({ onMenuItemClick }) => {
  const methods = useForm<AddSkillsFormData>({
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = (data: AddSkillsFormData) => {
    toast.success("Skills Saved Successfully");  
    console.log("Form data:", data);
    onMenuItemClick("skillsAndTools"); 
    // TODO: Replace with actual submission logic (e.g., API call)
  };
  
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

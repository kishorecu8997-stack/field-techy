import { skillsData } from "@/dummy_data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TagSelectField } from "@/shared/components/commonUI/inputs/TagSelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
const AddSkills = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const methods = useForm<AddSkillsFormData>({
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = async (_: AddSkillsFormData) => {
    await showPopup({
      title: "Add Skills",
      body: "Are you sure you want to add these skills?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Skills Added Successfully");
            close(true);
            setActiveKey("skillsAndTools");
          },
        },
      ],
    });
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

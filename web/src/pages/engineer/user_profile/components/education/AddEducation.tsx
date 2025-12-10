import {
  courses,
  educationLevels,
  majors,
  universities,
} from "@/dummy_data/engineer_profile/education-data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { validatePassingYear } from "../../Validate";
import type { EducationFormData } from "./types";


/**
 * The AddEducation component renders a form for adding a new education entry.
 * It uses `react-hook-form` for form management and validation.
 * @param {AddEducationProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered AddEducation form component.
 */
const AddEducation = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const handleSubmit = async (data: EducationFormData) => {
    await showPopup({
      title: "Add Education",
      body: "Are you sure you want to add this education?",
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
            toast.success("Education Added Successfully");
            console.log(data);
            close(true);
            setActiveKey("education");
          },
        },
      ],
    });
  };
  const methods = useForm<EducationFormData>({
    defaultValues: {
      educationLevel: "",
      course: "",
      university: "",
      majorSubject: "",
      passingYear: "",
    },
    mode: "onSubmit",
  });

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <SelectField
          label="Education Level"
          isShowLabel={false}
          name="educationLevel"
          placeholder="Education Level"
          options={educationLevels.map((e) => ({
            value: e.key,
            label: e.label,
          }))}
          required
        />

        <SelectField
          label="Course"
          isShowLabel={false}
          name="course"
          placeholder="Course"
          options={courses.map((c) => ({
            value: c.key,
            label: c.label,
          }))}
          required
        />

        <SelectField
          label="University"
          isShowLabel={false}
          name="university"
          placeholder="University"
          options={universities.map((u) => ({
            value: u.key,
            label: u.label,
          }))}
          required
        />

        <SelectField
          label="Major Subject"
          isShowLabel={false}
          name="majorSubject"
          placeholder="Major Subject"
          options={majors.map((m) => ({
            value: m.key,
            label: m.label,
          }))}
          required
        />
        <InputField
          label="Passing Year"
          isShowLabel={false}
          name="passingYear"
          placeholder="Passing Year"
          required
          rules={{ validate: (v: string) => validatePassingYear(v) }}
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

export default AddEducation;

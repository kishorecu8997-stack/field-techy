import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import {
  validateMajorSubject,
  validatePassingYear,
  validateUniversity,
} from "../../Validate";
import type { EducationFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import {
  educationLevels,
  courses,
} from "@/dummy_data/engineer_profile/education-data";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * The AddEducation component renders a form for adding a new education entry.
 * It uses `react-hook-form` for form management and validation.
 * @returns {React.ReactElement} The rendered AddEducation form component.
 */
const AddEducation: React.FC = ({}) => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const handleSubmit = async (_: EducationFormData) => {
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

        <InputField
          label="University"
          isShowLabel={true}
          name="university"
          placeholder="Enter university name (e.g., University of Example)"
          aria-required="true"
          required
          rules={{ validate: (v: string) => validateUniversity(v) }}
        />

        <InputField
          label="Major Subject"
          isShowLabel={true}
          name="major_Subject"
          placeholder="Enter major subject name (e.g. Physics)"
          aria-required="true"
          required
          rules={{ validate: (v: string) => validateMajorSubject(v) }}
        />

        <InputField
          label="Passing Year"
          isShowLabel={false}
          name="year"
          placeholder="Passing Year"
          rules={{
            required: "Passing year is required",
            validate: validatePassingYear,
          }}
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

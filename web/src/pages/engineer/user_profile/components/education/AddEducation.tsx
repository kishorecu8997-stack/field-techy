import React from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { educationFieldData } from "@/dummy_data";
import { validatePassingYear } from "../../Validate";
import type { EducationFormData } from "./types";

interface AddEducationProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}

/**
 * The AddEducation component renders a form for adding a new education entry.
 * It uses `react-hook-form` for form management and validation.
 * @param {AddEducationProps} props - The props for the component.
 * @param {function(): void} props.onClose - Callback to close the parent drawer/sidebar.
 * @param {function(string): void} props.onMenuItemClick - Callback to navigate to other profile sections.
 * @returns {React.ReactElement} The rendered AddEducation form component.
 */
const AddEducation: React.FC<AddEducationProps> = ({}) => {
  const handleSubmit = (data: EducationFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
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
          options={educationFieldData.educationLevels.map((e) => ({
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
          options={educationFieldData.courses.map((c) => ({
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
          options={educationFieldData.universities.map((u) => ({
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
          options={educationFieldData.majors.map((m) => ({
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

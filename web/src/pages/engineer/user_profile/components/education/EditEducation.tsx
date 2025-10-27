import React from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validatePassingYear } from "../../Validate";
import { educationFieldData } from "@/dummy_data";
import type { EducationFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";

interface EditEducationProps {
  /** The education data to pre-fill in the form for editing. */
  educationData?: EducationFormData; // Optional for demonstration
}

/**
 * The EditEducation component renders a form to modify an existing education entry.
 * It uses `react-hook-form` for form management and validation. The form is
 * pre-populated with the data passed via the `educationData` prop.
 * @param {EditEducationProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditEducation form component.
 */
const EditEducation: React.FC<EditEducationProps> = ({ educationData }) => {
  const handleSubmit = (data: EducationFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: Replace with actual submission logic (e.g., API call to update)
  };

  const methods = useForm<EducationFormData>({
    defaultValues: educationData || {
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

export default EditEducation;

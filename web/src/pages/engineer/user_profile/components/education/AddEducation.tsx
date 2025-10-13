/**
 * @file AddEducation.tsx
 * @description This component provides a form for users to add their educational qualifications.
 * It is designed to be displayed within a drawer or modal, featuring input fields for
 * education level, course, university, major, and passing year, with validation.
 */
import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { educationFieldData } from "@/dummyData";
import { validatePassingYear } from "../../Validate";

/**
 * Shape of the form data used by the Add Education form.
 *
 * @typedef {Object} AddEducationFormData
 * @property {string} educationLevel - Selected education level (e.g. 'bachelor').
 * @property {string} course - Selected course identifier or name.
 * @property {string} university - Selected or entered university name.
 * @property {string} majorSubject - Major subject of study.
 * @property {string} passingYear - Four digit passing year (as string to support form input).
 */
export type AddEducationFormData = {
  educationLevel: string;
  course: string;
  university: string;
  majorSubject: string;
  passingYear: string;
};

/**
 * Props for the AddEducation component.
 *
 * onClose: Callback invoked when the drawer or modal should be closed.
 */
interface AddEducationProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
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
const AddEducation: React.FC<AddEducationProps> = ({ onClose, onMenuItemClick }) => {

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the education data.
   * @param {AddEducationFormData} data - The validated form data from react-hook-form.
   */
  const handleSubmit = (data: AddEducationFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form` with default values for the education form.
   */
  const methods = useForm<AddEducationFormData>({
    defaultValues: {
      educationLevel: "",
      course: "",
      university: "",
      majorSubject: "",
      passingYear: "",
    },
  });

  return (
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader title="Add Education" onClose={onClose} onBack={() => onMenuItemClick('education')}/>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Education Level */}
          <SelectField
            name="educationLevel"
            placeholder="Education Level"
            options={educationFieldData.educationLevels.map((e) => ({ value: e.key, label: e.label }))}
            required
          />

          <SelectField
            name="course"
            placeholder="Course"
            options={educationFieldData.courses.map((c) => ({ value: c.key, label: c.label }))}
            required
          />

          <SelectField
            name="university"
            placeholder="University"
            options={educationFieldData.universities.map((u) => ({ value: u.key, label: u.label }))}
            required
          />

          <SelectField
            name="majorSubject"
            placeholder="Major Subject"
            options={educationFieldData.majors.map((m) => ({ value: m.key, label: m.label }))}
            required
          />
          <InputField type="number"
            name="passingYear"
            placeholder="Passing Year"
            maxLength={4}
            minLength={4}
            required
            rules={{ validate: (v: string) => validatePassingYear(v) }}
          />


        </div>

        {/* Fixed bottom button */}
        <div className=" bottom-0  p-10 bg-white ">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default AddEducation;

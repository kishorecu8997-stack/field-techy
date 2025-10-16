/**
 * @file EditEducation.tsx
 * @description This component provides a form for users to edit an existing educational qualification.
 * It is designed to be displayed within a drawer or modal, pre-populated with the data
 * of the education entry being edited.
 */
import React, { useEffect } from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validatePassingYear } from "../../Validate";
import { educationFieldData } from "@/dummy_data";

/**
 * Shape of the form data used by the Edit Education form.
 *
 * @typedef {Object} EditEducationFormData
 * @property {string} educationLevel - Selected education level (e.g. 'bachelor').
 * @property {string} course - Selected course identifier or name.
 * @property {string} university - Selected or entered university name.
 * @property {string} majorSubject - Major subject of study.
 * @property {string} passingYear - Four digit passing year (as string to support form input).
 */
export type EditEducationFormData = {
  educationLevel: string;
  course: string;
  university: string;
  majorSubject: string;
  passingYear: string;
};

/**
 * Props for the EditEducation component.
 */
interface EditEducationProps {
  /** The education data to pre-fill in the form for editing. */
  educationData?: EditEducationFormData; // Optional for demonstration
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The EditEducation component renders a form to modify an existing education entry.
 * It uses `react-hook-form` for form management and validation. The form is
 * pre-populated with the data passed via the `educationData` prop.
 * @param {EditEducationProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditEducation form component.
 */
const EditEducation: React.FC<EditEducationProps> = ({ onClose, onMenuItemClick, educationData }) => {

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to update the education data.
   * @param {EditEducationFormData} data - The validated form data from react-hook-form.
   */
  const handleSubmit = (data: EditEducationFormData) => {
    console.log("Form submitted with updated data:", data);
    // TODO: Replace with actual submission logic (e.g., API call to update)
  };

  /**
   * Initializes `react-hook-form` with default values for the education form.
   * If `educationData` is provided, it's used to pre-fill the form.
   */
  const methods = useForm<EditEducationFormData>({
    defaultValues: educationData || {
      educationLevel: "",
      course: "",
      university: "",
      majorSubject: "",
      passingYear: "",
    },
    mode: "onSubmit",
  });

  /**
   * Effect to reset the form values if the `educationData` prop changes.
   * This ensures the form updates if the user selects a different education
   * entry to edit without closing the drawer.
   */
  useEffect(() => {
    if (educationData) {
      methods.reset(educationData);
    }
  }, [educationData, methods]);

  return (
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader title="Edit Education" onClose={onClose} onBack={() => onMenuItemClick('education')} />

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
          <InputField           
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

export default EditEducation;

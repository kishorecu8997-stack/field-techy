import {
  courses,
  educationEdit,
  educationLevels,
} from "@/dummy_data/engineer_profile/education-data";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateMajorSubject, validatePassingYear, validateUniversity } from "../../Validate";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { toast } from "react-toastify";
import type { EducationFormData } from "./types";

/**
 * The EditEducation component renders a form to modify an existing education entry.
 * It uses `react-hook-form` for form management and validation. The form is
 * pre-populated with the data passed via the `educationData` prop.
 * @param {EditEducationProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered EditEducation form component.
 */
const EditEducation = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const getEducationById = () => {
    const id = localStorage.getItem("editEducationId");
    const educationId = id;
    return educationEdit.find((edu) => edu.id === +(educationId ?? ""));
  };

  useEffect(() => {
    // to prevent it from being used again accidentally.
    return () => {
      localStorage.removeItem("editEducationId");
    };
  }, []);

  const handleSubmit = async (data: EducationFormData) => {
    await showPopup({
      title: "Update Education",
      body: "Are you sure you want to update this education?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Education Updated Successfully");
            console.log(data);
            close(true);
            setActiveKey("education");
          },
        },
      ],
    });
  };

  const methods = useForm<EducationFormData>({
    defaultValues: getEducationById(),
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
          name="level"
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
          name="major"
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

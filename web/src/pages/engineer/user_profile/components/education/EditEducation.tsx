import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  validateMajorSubject,
  validatePassingYear,
  validateUniversity,
} from "../../Validate";
import type { EducationFormData } from "./types";

import {
  educationLevels,
  courses,
} from "@/dummy_data/engineer_profile/education-data";

import {
  useEngineerGetById,
  useEngineerUpdateById,
} from "@/shared/apiServices/engineer/engineerService";
import type { Education } from "@/shared/apiServices/engineer/engineerTypes";
import { getUserId } from "@/utils";

/**
 * EditEducation – unified component for both ADD and EDIT
 * Exactly like EditExperiences.tsx
 */
const EditEducation = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, selectedId } = useDrawerStore();

  const userId = getUserId();
  if (!userId) return null;

  const { data: engineerData } = useEngineerGetById(userId);
  const { mutateAsync } = useEngineerUpdateById(userId);

  const methods = useForm<EducationFormData>({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (selectedId && engineerData?.educations) {
      const education = engineerData.educations.find(
        (edu) => edu.id === selectedId,
      );

      if (education) {
        methods.reset({
          educationLevel: education.educationLevel || "",
          course: education.course || "",
          university: education.university || "",
          majorSubject: education.majorSubject || "",
          passingYear: education.passingYear
            ? String(education.passingYear)
            : "",
        });
        return;
      }
    }

    methods.reset({
      educationLevel: "",
      course: "",
      university: "",
      majorSubject: "",
      passingYear: "",
    });
  }, [engineerData, selectedId, methods]);

  const handleSubmit = async () => {
    await showPopup({
      title: selectedId ? "Update Education" : "Add Education",
      body: selectedId
        ? "Are you sure you want to update this education?"
        : "Are you sure you want to add this education?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => close(true),
        },
        {
          label: selectedId ? "Yes, update" : "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            if (!engineerData) return;

            const formData = methods.getValues();
            const currentEducations = engineerData.educations || [];

            let updatedEducations: Education[];

            if (selectedId) {
              updatedEducations = currentEducations.map((edu) => {
                if (edu.id === selectedId) {
                  edu.educationLevel = formData.educationLevel || undefined;
                  edu.course = formData.course || undefined;
                  edu.university = formData.university?.trim() || undefined;
                  edu.majorSubject = formData.majorSubject?.trim() || undefined;
                  edu.passingYear = formData.passingYear
                    ? Number(formData.passingYear)
                    : undefined;
                }
                return edu;
              });
            } else {
              const newEducation: Partial<Education> = {
                educationLevel: formData.educationLevel || undefined,
                course: formData.course || undefined,
                university: formData.university?.trim() || undefined,
                majorSubject: formData.majorSubject?.trim() || undefined,
                passingYear: formData.passingYear
                  ? Number(formData.passingYear)
                  : undefined,
              };

              updatedEducations = [
                ...currentEducations,
                newEducation as Education,
              ];
            }

            try {
              await mutateAsync({
                ...engineerData,
                educations:
                  updatedEducations.length > 0 ? updatedEducations : undefined,
              });

              toast.success(
                selectedId
                  ? "Education updated successfully"
                  : "Education added successfully",
              );

              close(true);
              setActiveKey("education");
            } catch (error) {
              console.error("Failed to save education:", error);
              toast.error("Failed to save education. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

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
          placeholder="Select education level"
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
          placeholder="Select course"
          options={courses.map((c) => ({
            value: c.key,
            label: c.label,
          }))}
          required
        />

        <InputField
          label="University"
          isShowLabel={false}
          name="university"
          placeholder="Enter university name"
          required
          rules={{ validate: (value: string) => validateUniversity(value) }}
        />

        <InputField
          label="Major Subject"
          isShowLabel={false}
          name="majorSubject"
          placeholder="Enter major subject"
          required
          rules={{ validate: (value: string) => validateMajorSubject(value) }}
        />

        <InputField
          label="Passing Year"
          isShowLabel={false}
          name="passingYear"
          placeholder="e.g., 2023"
          allowedCharacters="numbers"
          required
          rules={{ validate: (value: string) => validatePassingYear(value) }}
        />
      </div>

      <div className="bg-white">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {selectedId ? "Update" : "Add"} Education
        </Button>
      </div>
    </FormContainer>
  );
};

export default EditEducation;

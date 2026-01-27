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
  useEngineerAddEducation,
  useEngineerGetEducation,
  useEngineerUpdateEducation,
  useLookupData
} from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * EditEducation – unified component for both ADD and EDIT
 */
const EditEducation = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, selectedId } = useDrawerStore();

  const { data: educations } = useEngineerGetEducation();
  const updateMutation = useEngineerUpdateEducation();
  const addMutation = useEngineerAddEducation();

  const methods = useForm<EducationFormData>({
    mode: "onSubmit",
  });

  const selectedEducationLevel = methods.watch("educationLevel");

  const { data: levels, isLoading: isLoadingLevels } = useLookupData("educationLevels");
  const { data: coursesData, isLoading: isLoadingCourses } = useLookupData("courses", selectedEducationLevel || undefined);

  useEffect(() => {
    if (selectedId && educations) {
      const education = educations.find(
        (edu) => String(edu.id) === String(selectedId),
      );

      if (education) {
        methods.reset({
          educationLevel: String(education.level) || "",
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
  }, [educations, selectedId, methods]);

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
            const formData = methods.getValues();

            try {
              if (selectedId) {
                await updateMutation.mutateAsync({
                  path: { id: String(selectedId) },
                  body: {
                    level: Number(formData.educationLevel),
                    course: formData.course || undefined,
                    university: formData.university?.trim() || undefined,
                    majorSubject: formData.majorSubject?.trim() || undefined,
                    passingYear: formData.passingYear ? Number(formData.passingYear) : undefined,
                  }
                });
              } else {
                await addMutation.mutateAsync({
                  body: {
                    level: Number(formData.educationLevel),
                    course: formData.course || "",
                    university: formData.university?.trim() || "",
                    majorSubject: formData.majorSubject?.trim() || "",
                    passingYear: Number(formData.passingYear),
                  }
                });
              }

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
          placeholder={isLoadingLevels ? "Loading levels..." : "Select education level"}
          options={(levels || []).map((e) => ({
            value: String(e.id),
            label: e.name,
          }))}
          required
        />

        <SelectField
          label="Course"
          isShowLabel={false}
          name="course"
          placeholder={isLoadingCourses ? "Loading courses..." : "Select course"}
          options={(coursesData || []).map((c) => ({
            value: c.name,
            label: c.name,
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

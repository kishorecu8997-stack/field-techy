import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
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
  useLookupData
} from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * AddEducation – fully integrated with backend
 */
const AddEducation = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const addEducationMutation = useEngineerAddEducation();

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

  const selectedEducationLevel = methods.watch("educationLevel");

  const { data: levels, isLoading: isLoadingLevels } = useLookupData("educationLevels");
  const { data: coursesData, isLoading: isLoadingCourses } = useLookupData("courses", selectedEducationLevel || undefined);

  const handleSubmit = async (data: EducationFormData) => {
    await showPopup({
      title: "Add Education",
      body: "Are you sure you want to add this education?",
      actionButtons: [
        {
          label: "Cancel",
          variant: "danger",
          action: (close) => close(true),
          value: undefined,
        },
        {
          label: "Yes, add",
          variant: "primary",
          action: async (close) => {
            try {
              await addEducationMutation.mutateAsync({
                body: {
                  level: Number(data.educationLevel),
                  course: data.course || "",
                  university: data.university?.trim() || "",
                  majorSubject: data.majorSubject?.trim() || "",
                  passingYear: Number(data.passingYear),
                }
              });

              toast.success("Education added successfully");
              close(true);
              setActiveKey("education");
            } catch (error) {
              console.error("Failed to add education:", error);
              toast.error("Failed to add education. Please try again.");
              close(true);
            }
          },
          value: undefined,
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
          name="university"
          placeholder="Enter university name"
          required
          rules={{ validate: (value) => validateUniversity(value, true) }}
        />

        <InputField
          label="Major Subject"
          name="majorSubject"
          placeholder="Enter major subject (e.g., Physics)"
          required
          rules={{ validate: (value) => validateMajorSubject(value, true) }}
        />

        <InputField
          label="Passing Year"
          name="passingYear"
          placeholder="e.g., 2023"
          required
          rules={{ validate: (value) => validatePassingYear(value) }}
        />
      </div>

      <div className="bg-white">
        <Button
          type="submit"
        className="w-full bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded-none shadow-none border-none"
        >
          Save
        </Button>
      </div>
    </FormContainer>
  );
};

export default AddEducation;

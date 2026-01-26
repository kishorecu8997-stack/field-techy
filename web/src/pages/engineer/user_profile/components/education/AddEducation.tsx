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
 * AddEducation – fully integrated with backend, just like AddExperiences
 */
const AddEducation = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const userId = getUserId();
  if (!userId) return null;

  const { data: engineerData } = useEngineerGetById(userId);
  const { mutateAsync } = useEngineerUpdateById(userId);

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

  const handleSubmit = async (data: EducationFormData) => {
    await showPopup({
      title: "Add Education",
      body: "Are you sure you want to add this education?",
      actionButtons: [
        {
          label: "Cancel",
          variant: "secondary",
          action: (close) => close(true),
          value: undefined,
        },
        {
          label: "Yes, add",
          variant: "primary",
          action: async (close) => {
            if (!engineerData) return;

            const newEducation: Partial<Education> = {
              educationLevel: data.educationLevel || undefined,
              course: data.course || undefined,
              university: data.university?.trim() || undefined,
              majorSubject: data.majorSubject?.trim() || undefined,
              passingYear: data.passingYear
                ? Number(data.passingYear)
                : undefined,
            };

            const updatedEducations = [
              ...(engineerData.educations || []),
              newEducation as Education,
            ];

            try {
              await mutateAsync({
                ...engineerData,
                educations:
                  updatedEducations.length > 0 ? updatedEducations : undefined,
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
          rules={{ validate: (value) => validateUniversity(value, true) }}
        />

        <InputField
          label="Major Subject"
          isShowLabel={false}
          name="majorSubject"
          placeholder="Enter major subject (e.g., Physics)"
          required
          rules={{ validate: (value) => validateMajorSubject(value, true) }}
        />

        <InputField
          label="Passing Year"
          isShowLabel={false}
          name="passingYear"
          placeholder="e.g., 2023"
          required
          rules={{ validate: (value) => validatePassingYear(value) }}
        />
      </div>

      <div className="bg-white">
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

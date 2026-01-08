import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCompany, validateDateRange } from "../../../Validate";
import type { ExperiencesFormData } from "./types";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";

import {
  designationOptions,
  employmentTypeOptions,
  workLocationTypeOptions,
} from "./constants";
import {
  useEngineerGetById,
  useEngineerUpdateById,
} from "@/shared/apiServices/engineer/engineerService";
import type { Experience } from "@/shared/apiServices/engineer/engineerTypes";
import { getUserId } from "@/utils";

/**
 * The EditExperiences component renders a form to modify an existing work experience.
 * It uses `react-hook-form` for management and validation, and is pre-populated
 * with the data passed via the `experienceData` prop.
 * @param {EditExperiencesProps} props - Component props.
 * @returns {React.ReactElement} The rendered EditExperiences form component.
 */
const EditExperiences = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, selectedId } = useDrawerStore();

  const userId = getUserId();
  if (!userId) return null;
  const { data: engineerData } = useEngineerGetById(userId);
  console.log("Engineer Data:", engineerData);

  const methods = useForm<ExperiencesFormData>({
    mode: "onSubmit",
  });

  const { mutateAsync } = useEngineerUpdateById(userId);

  useEffect(() => {
    if (engineerData?.experiences && selectedId) {
      const experience = engineerData.experiences.find(
        (exp) => exp.id === selectedId
      );
      if (experience) {
        methods.reset({
          id: experience.id || "",
          designation: experience.designation,
          employer: experience.employer,
          workLocationType: experience.workLocationType,
          employmentType: experience.employmentType,
          startDate: experience.startDate
            ? new Date(experience.startDate)
            : null,
          endDate:
            experience.endDate && experience.endDate !== "present"
              ? new Date(experience.endDate)
              : null,
          isCurrent:
            experience.isCurrent ||
            !experience.endDate ||
            experience.endDate === "present",
        });
      }
    }
  }, [engineerData, selectedId, methods]);

  const handleSubmit = async (_: ExperiencesFormData) => {
    await showPopup({
      title: "Update Experience",
      body: "Are you sure you want to update this experience?",
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
            if (!engineerData) return;
            const experiences = engineerData?.experiences || [];
            const formData = methods.getValues();

            const updatedExperience: Experience = {
              id: formData.id,
              designation: formData.designation,
              employer: formData.employer,
              workLocationType: formData.workLocationType,
              employmentType: formData.employmentType,
              startDate: formData.startDate?.toISOString().split("T")[0] || "",
              endDate: formData.isCurrent
                ? null
                : formData.endDate?.toISOString().split("T")[0] || null,
            };

            const updatedExperiences = experiences.map((exp) =>
              exp.id === selectedId ? updatedExperience : exp
            );
            try {
              await mutateAsync({
                ...engineerData,
                experiences: updatedExperiences,
              });
              toast.success("Experience Updated Successfully");
              close(true);
              setActiveKey("experiences");
            } catch (error) {
              console.error("Failed to update experience:", error);
              toast.error("Failed to update experience. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("editExperiencesId");
    };
  }, []);

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <SelectField
          label="Designation"
          isShowLabel={false}
          name="designation"
          placeholder="Designation"
          options={designationOptions.map((e) => ({
            value: e.id,
            label: e.title,
          }))}
          required
        />
        <InputField
          label="Employer"
          isShowLabel={false}
          name="employer"
          placeholder="Employer"
          required
          rules={{ validate: (v: string) => validateCompany(v) }}
        />
        <SelectField
          label="Work Location Type"
          isShowLabel={false}
          name="workLocationType"
          placeholder="Work Location Type"
          options={workLocationTypeOptions}
          required
        />
        <SelectField
          label="Employment Type"
          isShowLabel={false}
          name="employmentType"
          placeholder="Employment Type"
          options={employmentTypeOptions}
          required
        />
        <DatePickerInput
          name="startDate"
          label="Start Date"
          isShowLabel={false}
          placeholder="Start date"
          required
          maxDate={new Date()}
          rules={{
            validate: (value) =>
              validateDateRange(value, methods.getValues("endDate") || null),
          }}
        />

        {!methods.watch("isCurrent") && (
          <DatePickerInput
            name="endDate"
            label="End Date"
            isShowLabel={false}
            placeholder="End date (required if not current)"
            minDate={methods.watch("startDate") || new Date(1970, 0, 1)}
            required={!methods.watch("isCurrent")}
            rules={{
              validate: (value) => {
                if (!methods.watch("isCurrent") && !value) {
                  return "End date is required when not currently working";
                }
                return true;
              },
              onChange: () => methods.trigger("startDate"),
            }}
          />
        )}

        {/* Checkbox label */}
        <CheckboxInput
          name="isCurrent"
          label="I currently work here"
          isShowLabel={true}
          rules={{
            onChange: (e) => {
              const checked = e.target.checked;
              if (checked) {
                methods.setValue("endDate", null);
              }
            },
          }}
        />
      </div>

      {/* Fixed bottom button */}
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

export default EditExperiences;

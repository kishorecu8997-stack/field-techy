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
 * EditExperiences component – now handles both ADDING a new experience
 * and EDITING an existing one based on whether selectedId is present.
 */
const EditExperiences = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, selectedId } = useDrawerStore();

  const userId = getUserId();
  if (!userId) return null;

  const { data: engineerData } = useEngineerGetById(userId);
  const { mutateAsync } = useEngineerUpdateById(userId);

  const methods = useForm<ExperiencesFormData>({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (selectedId && engineerData?.experiences) {
      const experience = engineerData.experiences.find(
        (exp) => exp.id === selectedId,
      );

      if (experience) {
        methods.reset({
          designation: experience.designation,
          employer: experience.employer,
          workLocationType: experience.workLocationType,
          employmentType: experience.employmentType,
          startDate: experience.startDate
            ? new Date(experience.startDate)
            : null,
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          isCurrent: experience.isCurrent ?? !experience.endDate,
        });
        return;
      }
    }

    methods.reset({
      designation: "",
      employer: "",
      workLocationType: "",
      employmentType: "",
      startDate: null,
      endDate: null,
      isCurrent: false,
    });
  }, [engineerData, selectedId, methods]);

  const handleSubmit = async () => {
    await showPopup({
      title: selectedId ? "Update Experience" : "Add Experience",
      body: selectedId
        ? "Are you sure you want to update this experience?"
        : "Are you sure you want to add this experience?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "danger",
          action: async (close) => close(true),
        },
        {
          label: selectedId ? "Yes, update" : "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            if (!engineerData) return;

            const formData = methods.getValues();
            const currentExperiences = engineerData.experiences || [];

            let updatedExperiences: Experience[];

            if (selectedId) {
              updatedExperiences = currentExperiences.map((exp) => {
                if (exp.id === selectedId) {
                  exp.designation = String(formData.designation ?? "");
                  exp.employer = (formData.employer || "").trim();
                  exp.workLocationType = formData.workLocationType as string;
                  exp.employmentType = formData.employmentType as string;
                  exp.startDate =
                    formData.startDate?.toISOString().split("T")[0] || "";
                  exp.endDate = formData.isCurrent
                    ? undefined // ← Fixed: undefined instead of null
                    : formData.endDate?.toISOString().split("T")[0] ||
                      undefined;
                  exp.isCurrent = formData.isCurrent;
                }
                return exp;
              });
            } else {
              const newExperience: Experience = {
                designation: String(formData.designation ?? ""),
                employer: (formData.employer || "").trim(),
                workLocationType: formData.workLocationType as string,
                employmentType: formData.employmentType as string,
                startDate:
                  formData.startDate?.toISOString().split("T")[0] || "",
                endDate: formData.isCurrent
                  ? undefined
                  : formData.endDate?.toISOString().split("T")[0] || undefined,
                isCurrent: formData.isCurrent,
              };

              updatedExperiences = [...currentExperiences, newExperience];
            }

            try {
              await mutateAsync({
                ...engineerData,
                experiences:
                  updatedExperiences.length > 0
                    ? updatedExperiences
                    : undefined,
              });

              toast.success(
                selectedId
                  ? "Experience updated successfully"
                  : "Experience added successfully",
              );

              close(true);
              setActiveKey("experiences");
            } catch (error) {
              console.error("Failed to save experience:", error);
              toast.error("Failed to save experience. Please try again.");
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
          label="Designation"
          isShowLabel={false}
          name="designation"
          placeholder="Designation"
          options={designationOptions.map((e) => ({
            value: e.value,
            label: e.label,
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
            maxDate={new Date()}
            required={!methods.watch("isCurrent")}
            rules={{
              validate: (value) => {
                if (!methods.watch("isCurrent")) {
                  if (!value)
                    return "End date is required when not currently working";

                  const start = methods.getValues("startDate");
                  if (start && value && start > value) {
                    return "End date must be after start date";
                  }
                }
                return true;
              },
              onChange: () => methods.trigger("startDate"),
            }}
          />
        )}

        <CheckboxInput
          name="isCurrent"
          label="I currently work here"
          isShowLabel={true}
        />
      </div>

      <div className="bg-white">
        <Button
          type="submit"
      className="w-full bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded-none shadow-none border-none"

        >
          {selectedId ? "Update" : "Add"} Experience
        </Button>
      </div>
    </FormContainer>
  );
};

export default EditExperiences;

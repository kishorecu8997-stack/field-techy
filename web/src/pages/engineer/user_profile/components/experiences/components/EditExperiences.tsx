import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";
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

import {
  useEngineerGetExperience,
  useEngineerUpdateExperience,
  useLookupData,
} from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * EditExperiences component handles updating an existing experience.
 */
const EditExperiences = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, selectedId } = useDrawerStore();

  const { data: experiences } = useEngineerGetExperience();
  const { mutateAsync: updateExperience } = useEngineerUpdateExperience();
  const { data: workLocations } = useLookupData("workLocations");
  const { data: employmentTypes } = useLookupData("employmentTypes");
  const { data: designations } = useLookupData("serviceCategories");

  const methods = useForm<ExperiencesFormData>({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (selectedId && experiences) {
      const experience = experiences.find(
        (exp) => exp.id.toString() === selectedId,
      );

      if (experience) {
        methods.reset({
          designation: experience.designation || "",
          employer: experience.employer || "",
          workLocationType: experience.workLocationId?.toString() || "",
          employmentType: experience.employmentTypeId?.toString() || "",
          startDate: experience.startDate
            ? new Date(experience.startDate)
            : null,
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          isCurrent: !experience.endDate,
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
  }, [experiences, selectedId, methods]);

  const handleSubmit = async () => {
    if (!selectedId) return;

    await showPopup({
      title: "Update Experience",
      body: "Are you sure you want to update this experience?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "danger",
          action: async (close) => close(true),
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            const formData = methods.getValues();

            const updatedExperience = {
              designation: String(formData.designation ?? ""),
              employer: (formData.employer || "").trim(),
              employmentTypeId: Number(formData.employmentType),
              workLocationId: Number(formData.workLocationType),
              startDate: formData.startDate?.toISOString().split("T")[0] || "",
              endDate: formData.isCurrent
                ? null
                : formData.endDate?.toISOString().split("T")[0] || null,
            };

            try {
              await updateExperience({
                path: { id: String(selectedId) },
                body: updatedExperience as any,
              });

              toast.success("Experience updated successfully");
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
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        <SelectField
          label="Designation"
          name="designation"
          placeholder="Designation"
          options={
            designations?.map((e) => ({
              value: e.id,
              label: e.name,
            })) || []
          }
          required
        />
        <InputField
          label="Employer"
          name="employer"
          placeholder="Employer"
          required
          rules={{ validate: (v: string) => validateCompany(v) }}
        />
        <SelectField
          label="Work Location Type"
          name="workLocationType"
          placeholder="Work Location Type"
          options={
            workLocations?.map((item) => ({
              value: item.id.toString(),
              label: item.name,
            })) || []
          }
          required
        />
        <SelectField
          label="Employment Type"
          name="employmentType"
          placeholder="Employment Type"
          options={
            employmentTypes?.map((item) => ({
              value: item.id.toString(),
              label: item.name,
            })) || []
          }
          required
        />
        <DatePickerInput
          name="startDate"
          label="Start Date"
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
          Update Experience
        </Button>
      </div>
    </FormContainer>
  );
};

export default EditExperiences;

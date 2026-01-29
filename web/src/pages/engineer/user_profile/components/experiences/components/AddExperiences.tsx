import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { validateCompany, validateDateRange } from "../../../Validate";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import type { ExperiencesFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  designationOptions,
} from "./constants";
import { toast } from "react-toastify";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";
import {
  useEngineerAddExperience,
  useLookupData
} from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * The AddExperiences component renders a form for adding a new work experience entry.
 * It uses `react-hook-form` for form management, validation, and submission.
 * @returns {React.ReactElement} The rendered AddExperiences form component.
 */
const AddExperiences = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const { mutateAsync: addExperience } = useEngineerAddExperience();
  const { data: workLocations } = useLookupData("workLocations");
  const { data: employmentTypes } = useLookupData("employmentTypes");

  const handleSubmit = async (data: ExperiencesFormData) => {
    await showPopup({
      title: "Add Experience",
      body: "Are you sure you want to add this experience?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close: (v: boolean) => void) => {
            close(true);
          },
        },
        {
          label: "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close: (v: boolean) => void) => {
            const newExperience = {
              designation: String(data.designation ?? ""),
              employer: (data.employer || "").trim(),
              employmentTypeId: Number(data.employmentType),
              workLocationId: Number(data.workLocationType),
              startDate: data.startDate?.toISOString().split("T")[0] || "",
              endDate: data.isCurrent
                ? undefined
                : data.endDate?.toISOString().split("T")[0] || undefined,
            };

            try {
              await addExperience({ body: newExperience });
              toast.success("Experience Added Successfully");
              close(true);
              setActiveKey("experiences");
            } catch (error: unknown) {
              console.error("Failed to add experience:", error);
              toast.error(GlobalApiErrorHandler.handle(error).message);
              close(true);
            }
          },
        },
      ],
    });
  };

  /**
   * Initializes `react-hook-form` with default values and sets the validation
   * mode to 'onChange' to provide immediate feedback to the user.
   */
  const methods = useForm<ExperiencesFormData>({
    defaultValues: {
      designation: "",
      employer: "",
      workLocationType: "",
      employmentType: "",
      startDate: null,
      endDate: null,
      isCurrent: false,
    },
    mode: "onSubmit",
  });

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
          options={designationOptions.map((e) => ({
            value: e.value,
            label: e.label,
          }))}
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
          options={workLocations?.map((item: { id: number; name: string }) => ({
            value: item.id.toString(),
            label: item.name,
          })) || []}
          required
        />

        <SelectField
          label="Employment Type"
          name="employmentType"
          placeholder="Employment Type"
          options={employmentTypes?.map((item: { id: number; name: string }) => ({
            value: item.id.toString(),
            label: item.name,
          })) || []}
          required
        />
        <DatePickerInput
          name="startDate"
          label="Start Date"
          placeholder="Start Date"
          required
          maxDate={new Date()}
          rules={{
            validate: (value) =>
              validateDateRange(value, methods.getValues("endDate")),
          }}
        />

        <div id="endDateSection">
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
        </div>

        {/* Checkbox label */}
        <CheckboxInput
          name="isCurrent"
          label="I currently work here"
          isShowLabel={true}
          rules={{
            onChange: (e) => {
              const checked = e.target.checked;
              methods.setValue("isCurrent", checked);
              if (checked) {
                methods.setValue("endDate", null); // Remove end date
              }
            },
          }}
        />
      </div>

      {/* Fixed bottom button */}
      <div className=" bg-white ">
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

export default AddExperiences;

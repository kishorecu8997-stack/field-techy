import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { validateCompany, validateDateRange,validateEndDate } from "../../../Validate";
import type { ExperiencesFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  designationOptions,
  employmentTypeOptions,
  workLocationTypeOptions,
} from "./constants";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * The AddExperiences component renders a form for adding a new work experience entry.
 * It uses `react-hook-form` for form management, validation, and submission.
 * @param {AddExperiencesProps} props - Component props.
 * @returns {React.ReactElement} The rendered AddExperiences form component.
 */
const AddExperiences = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const handleSubmit = async (data: ExperiencesFormData) => {
    await showPopup({
      title: "Add Experience",
      body: "Are you sure you want to add this experience?",
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
          label: "Yes, add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Experience Added Successfully");
            close(true);
            setActiveKey("experiences");
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
    },
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
          placeholder="DD/MM/YYYY"
          required
          maxDate={new Date()}
          rules={{
            validate: (value) =>
              validateDateRange(value, methods.getValues("endDate")),
          }}
        />
        
        <DatePickerInput
          name="endDate"
          label="End Date"
          isShowLabel={false}
          placeholder="DD/MM/YYYY"
          minDate={methods.watch("startDate") || new Date(1970, 0, 1)}
          maxDate={new Date()}
          rules={{
            onChange: () => methods.trigger("startDate"),
            validate: validateEndDate,
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

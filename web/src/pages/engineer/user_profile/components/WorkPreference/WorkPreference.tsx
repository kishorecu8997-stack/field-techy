import { InputField } from "@/shared/components/commonUI/inputs";
import { RiTodoLine } from "react-icons/ri";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { FiLink2 } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { CiWallet } from "react-icons/ci";
import { useForm } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { preferredWorkTypesData, servicesCategoriesData } from "@/dummy_data";
import { validatePortfolioLink, validateRate } from "../../Validate";
import type { WorkPreferenceFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import {workPreferenceData} from "@/dummy_data/engineer_profile/workPreferenceData";

interface WorkPreferenceProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}
/**
 * The WorkPreference component renders a form for users to edit their work-related preferences.
 * It uses `react-hook-form` for state management and validation.
 * @param {WorkPreferenceProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered WorkPreference form component.
 */

const WorkPreference: React.FC<WorkPreferenceProps> = ({onMenuItemClick,onClose}) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the preference data.
   * @param {WorkPreferenceFormData} data - The validated form data.
   */
  const handleSubmit = (data: WorkPreferenceFormData) => {
    toast.success("Work Preferences Saved Successfully");
    console.log("Form submitted with data:", data);
    onMenuItemClick("profile")
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form` with default values for the work preference form.
   */
  const methods = useForm<WorkPreferenceFormData>({
    defaultValues: {
      portfolioLink:workPreferenceData[0].portfolioLink,
      preferredWorkTypes: workPreferenceData[0].preferredWorkTypeIds,
      servicesCategories: workPreferenceData[0].serviceCategoryIds,
      ratePreference: workPreferenceData[0].ratePreference,
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
        <InputField
          label="Portfolio Link"
          isShowLabel={false}
          name="portfolioLink"
          type="text"
          placeholder="Portfolio Link"
          leftIcon={<FiLink2 className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validatePortfolioLink(v) }}
        />
        <SelectField
          label="Preferred Work Types"
          isShowLabel={false}
          name="preferredWorkTypes"
          placeholder="Preferred Work Type"
          leftIcon={<RiTodoLine className="text-lg text-gray-500" />}
          options={preferredWorkTypesData.map((e) => ({
            value: e.id,
            label: e.type,
          }))}
          required
        />
        <SelectField
          label="Services Categories"
          isShowLabel={false}
          name="servicesCategories"
          placeholder="Services Categories"
          leftIcon={<HiOutlineBriefcase className="text-lg text-gray-500" />}
          options={servicesCategoriesData.map((e) => ({
            value: e.id,
            label: e.category,
          }))}
          required
        />

        <InputField
          label="Rate Preference"
          isShowLabel={false}
          name="ratePreference"
          placeholder="Hourly/Fixed Rate Preference"
          leftIcon={<CiWallet className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateRate(v) }}
        />
      </div>

      <div className="bg-white ">
        <Button
          type="submit"          
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Save Preferences
        </Button>
      </div>
    </FormContainer>
  );
};

export default WorkPreference;

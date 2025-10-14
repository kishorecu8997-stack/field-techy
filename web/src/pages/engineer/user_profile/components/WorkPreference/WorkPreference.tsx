/**
 * @file WorkPreference.tsx
 * @description This component provides a form for users to set their work preferences.
 * It includes fields for portfolio link, preferred work types, service categories,
 * and rate preferences. It's designed to be displayed within a drawer.
 */
import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { InputField } from "@/shared/components/commonUI/inputs";
import { RiTodoLine } from "react-icons/ri";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { FiLink2 } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { CiWallet } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Buttons";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { preferredWorkTypesData, servicesCategoriesData } from "@/dummyData";
import { validateRate } from "../../Validate";

/**
 * @typedef {Object} WorkPreferenceFormData
 * @property {string} portfolioLink - A URL to the user's portfolio.
 * @property {string} preferredWorkTypes - The key for the selected preferred work type.
 * @property {string} servicesCategories - The key for the selected service category.
 * @property {string} ratePreference - The user's hourly or fixed rate preference.
 */
export type WorkPreferenceFormData = {
  portfolioLink: string;
  preferredWorkTypes: string;
  servicesCategories: string;
  ratePreference: string;
};

/**
 * Props for the WorkPreference component.
 */
interface WorkPreferenceProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The WorkPreference component renders a form for users to edit their work-related preferences.
 * It uses `react-hook-form` for state management and validation.
 * @param {WorkPreferenceProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered WorkPreference form component.
 */
const WorkPreference: React.FC<WorkPreferenceProps> = ({ onClose, onMenuItemClick }) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the preference data.
   * @param {WorkPreferenceFormData} data - The validated form data.
   */
  const handleSubmit = (data: WorkPreferenceFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form` with default values for the work preference form.
   */
  const methods = useForm<WorkPreferenceFormData>({
    defaultValues: {
      portfolioLink: "",
      preferredWorkTypes: "",
      servicesCategories: "",
      ratePreference: "",
    },
    mode: "onSubmit",
  });

  return (
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader
          title="Work Preference"
          onClose={onClose}
          onBack={() => {
            // When user clicks back, open Add Education view. This will allow returning back to this page
            onMenuItemClick("profile");
          }}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Portfolio Link */}
          <InputField
            name="portfolioLink"
            type="text"
            placeholder="Portfolio Link"
            leftIcon={<FiLink2 className="text-lg text-gray-500" />}
            required
          />
          <SelectField
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
            name="servicesCategories"
            placeholder="Services Categories"
            leftIcon={<HiOutlineBriefcase className="text-lg text-gray-500" />}
            options={servicesCategoriesData.map((e) => ({
              value: e.id,
              label: e.category,
            }))}
            required
          />

          {/* Rate Preference */}
          <InputField
            type="number"
            name="ratePreference"
            placeholder="Hourly/Fixed Rate Preference"
            leftIcon={<CiWallet className="text-lg text-gray-500" />}
            required    
            rules={{ validate: (v: string) => validateRate(v) }}
        
          />
        </div>

        {/* Fixed bottom button */}
        <div className=" bottom-0  p-10 bg-white ">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save Preferences
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default WorkPreference;

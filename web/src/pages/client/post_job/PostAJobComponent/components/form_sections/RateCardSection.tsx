import { useFormContext } from "react-hook-form";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import SectionHeader from "../../SectionHeader";
import { ENGAGEMENT_MODELS } from "@/dummy_data/jobFormOptions";

interface RateCardSectionProps {
  isDisable: boolean;
  serviceCategoryOptions: { label: string; value: string }[];
  experienceLevelOptions: { label: string; value: string }[];
  countryOptions: { label: string; value: string }[];
  rate: string | null;
}

/**
 * Rate Card Section Component
 * This component renders the rate card section of the job posting form.
 * @param {RateCardSectionProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered RateCardSection component.
 */
const RateCardSection = ({
  isDisable,
  serviceCategoryOptions,
  experienceLevelOptions,
  countryOptions,
  rate,
}: RateCardSectionProps) => {
  const { watch } = useFormContext();

  const summaryServiceCategory = watch("serviceCategory");
  const summaryExperienceLevel = watch("experienceLevel");
  const summaryEngagementModel = watch("engagementModel");
  const summaryCountry = watch("country");
  const summaryRate = rate ? `₹${rate}/Week` : "-";

  const getLabel = (
    options: { value: string; label: string }[],
    value?: string,
  ) => {
    if (!value) return "-";
    return options.find((opt) => opt.value === value)?.label || "-";
  };

  return (
    <div className="space-y-3">
      <SectionHeader title="Rate Card" />
      <div className="flex flex-col w-full gap-3">
        <SelectField
          label="Service Category"
          name="serviceCategory"
          placeholder="Select Service Category"
          options={serviceCategoryOptions}
          required
          disabled={isDisable}
        />
        <div className="flex flex-row w-full gap-4 items-center">
          <div className="w-1/2">
            <SelectField
              label="Engineer Experience Level"
              name="experienceLevel"
              placeholder="Select Experience Level"
              options={experienceLevelOptions}
              required
              disabled={isDisable}
            />
          </div>
          <div className="w-1/2">
            <SelectField
              label="Engagement Model"
              name="engagementModel"
              placeholder="Select Engagement Model"
              options={ENGAGEMENT_MODELS}
              required
              disabled={isDisable}
            />
          </div>
        </div>
        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-teal-900 text-white text-sm font-semibold px-4 py-2 grid grid-cols-5">
            <div>Service Category</div>
            <div>Experience Level</div>
            <div>Engagement Model</div>
            <div>Country</div>
            <div>Rate</div>
          </div>
          <div className="text-sm px-4 py-3 grid grid-cols-5 gap-2 bg-white dark:bg-gray-800">
            <div>
              {getLabel(serviceCategoryOptions, summaryServiceCategory)}
            </div>
            <div>
              {getLabel(experienceLevelOptions, summaryExperienceLevel)}
            </div>
            <div>{getLabel(ENGAGEMENT_MODELS, summaryEngagementModel)}</div>
            <div>{getLabel(countryOptions, summaryCountry)}</div>
            <div>{summaryRate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCardSection;

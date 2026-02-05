import { useFormContext } from "react-hook-form";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import MapWithSearch from "@/shared/components/MapWithSearch";
import SectionHeader from "../../SectionHeader";

interface LocationSectionProps {
  isDisable: boolean;
  countryOptions: { label: string; value: string }[];
  stateOptions: { label: string; value: string }[];
  cityOptions: { label: string; value: string }[];
  locationTypeOptions: { label: string; value: string }[];
}
/**
 * Location Section Component
 * This component renders the location section of the job posting form.
 * @param {LocationSectionProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered LocationSection component.
 */
const LocationSection = ({
  isDisable,
  countryOptions,
  stateOptions,
  cityOptions,
  locationTypeOptions,
}: LocationSectionProps) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext();
  const locationType = watch("locationType");

  const isRemote =
    locationTypeOptions
      ?.find((opt) => opt.value === locationType)
      ?.label.toLowerCase() === "remote";

  return (
    <div className="space-y-3">
      <SectionHeader title="Location" />
      <div className="flex flex-col md:flex-row w-full gap-4 items-start">
        <div className="w-full md:w-1/2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1 mb-1">
            Service Type
            <span className="text-red-500">*</span>
          </label>
          <div
            className={`w-full rounded-md px-4 py-2 flex items-center gap-4 border text-base ${
              errors.locationType
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <RadioField
              name="locationType"
              direction="horizontal"
              options={locationTypeOptions}
              isShowLabel={false}
              rules={{ required: "Service Type is required" }}
              containerClassName="w-full [&_p.mt-1]:hidden"
              disabled={isDisable}
            />
          </div>
          {errors.locationType && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.locationType.message as string}
            </p>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1 mb-1">
            Country
            <span className="text-red-500">*</span>
          </label>
          <SelectField
            label="Country"
            isShowLabel={false}
            name="country"
            placeholder="Select Country"
            options={countryOptions}
            required
            disabled={isDisable}
          />
        </div>
      </div>
      <div className="flex flex-row w-full gap-4 items-center">
        <div className="w-1/2">
          <SelectField
            label="State"
            name="state"
            placeholder="Select State"
            options={stateOptions}
            disabled={isDisable}
          />
        </div>
        <div className="w-1/2">
          <SelectField
            label="City"
            name="city"
            placeholder="Select City"
            options={cityOptions}
            disabled={isDisable}
          />
        </div>
      </div>
      {!isRemote && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3">
            <SectionHeader title="Work Location" />
          </div>
          <div className="px-3 pb-8">
            <MapWithSearch className="h-[380px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSection;

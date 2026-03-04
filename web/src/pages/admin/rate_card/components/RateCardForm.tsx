import {
  countryList,
  rateCardTypes,
} from "@/dummy_data/admin";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { useGetServiceCategories } from "@/shared/apiServices/admin/adminService";

/*
 * RateCardForm
 *
 * A form component for creating or editing a rate card.
 * Displays a form with fields for rate card type, service category, and country.
 * Renders a SelectField component for each field.
 *
 * @returns {JSX.Element} The rendered rate card form.
 */
const RateCardForm = () => {
  const ctx = useFormContext();

  // Fetch service categories from API
  const { data: serviceCategoriesData, isLoading } = useGetServiceCategories();

  // Transform API data to SelectField options format
  const serviceCategoryOptions = serviceCategoriesData?.data?.map((category) => ({
    label: category.name,
    value: `serviceCategory${category.id}`,
  })) || [];

  // Set default value for rateType to Master Rate Card on component mount
  useEffect(() => {
    ctx.setValue("rateType", "masterRateCard");
  }, [ctx]);

  return (
    <div className="p-2 flex flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          name="rateType"
          label="Rate Card Type"
          required
          options={rateCardTypes}
        />
        <SelectField
          name="country"
          required
          label="Country"
          options={countryList}
        />
        <SelectField
          name="serviceCategory"
          label="Service Category"
          options={serviceCategoryOptions}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default RateCardForm;

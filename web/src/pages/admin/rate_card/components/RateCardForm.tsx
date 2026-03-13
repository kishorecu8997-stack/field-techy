import { countryList, rateCardTypes } from "@/dummy_data/admin";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGetServiceCategories } from "@/shared/apiServices/admin/adminService";
import { useGetRateCards } from "@/shared/apiServices/admin/adminService";

/*
 * RateCardForm
 *
 * A form component for creating or editing a rate card.
 * Displays a form with fields for rate card type, service category, and country.
 * Renders a SelectField component for each field.
 *
 * @param {boolean} readOnly - If true, renders fields in read-only mode (disabled)
 * @returns {JSX.Element} The rendered rate card form.
 */
const RateCardForm: React.FC<{ readOnly?: boolean }> = ({
  readOnly = false,
}) => {
  const ctx = useFormContext();
  const { pathname } = useLocation();
  const isView = pathname.includes("/view");
  const isEdit = pathname.includes("/edit");

  // Fetch service categories from API
  const { data: serviceCategoriesData, isLoading } = useGetServiceCategories();

  // Fetch all rate cards to check for existing combinations
  const { data: rateCardsData } = useGetRateCards({ page: 1, limit: 100 });

  // Watch the selected country value
  const countryValue = ctx.watch("country");

  // Get the countryId from the selected country value (e.g., "country1" -> 1)
  const selectedCountryId = countryValue
    ? parseInt(countryValue.replace(/\D/g, "")) || 0
    : 0;

  // Get existing service category IDs for the selected country
  const existingServiceCategoryIds = rateCardsData?.data
    ?.filter((card) => card.countryId === selectedCountryId)
    .map((card) => card.serviceCategoryId) || [];

  // Get current service category from form
  const currentServiceCategory = ctx.watch("serviceCategory");

  // Transform API data to SelectField options format
  // In edit/view mode, include current service category even if it already exists
  const serviceCategoryOptions =
    serviceCategoriesData?.data
      ?.filter(
        (category) =>
          isView || isEdit
            ? true
            : !existingServiceCategoryIds.includes(category.id),
      )
      .map((category) => ({
        label: category.name,
        value: `serviceCategory${category.id}`,
      })) || [];

  // If in edit/view mode and current service category exists, ensure it's in options
  if ((isView || isEdit) && currentServiceCategory && !serviceCategoryOptions.some(opt => opt.value === currentServiceCategory)) {
    const currentCategory = serviceCategoriesData?.data?.find(
      (cat) => `serviceCategory${cat.id}` === currentServiceCategory
    );
    if (currentCategory) {
      serviceCategoryOptions.unshift({
        label: currentCategory.name,
        value: currentServiceCategory,
      });
    }
  }

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
          disabled={readOnly}
        />
        <SelectField
          name="country"
          required
          label="Country"
          options={countryList}
          disabled={readOnly}
        />
        <SelectField
          name="serviceCategory"
          label="Service Category"
          options={serviceCategoryOptions}
          disabled={isLoading || readOnly}
        />
      </div>
    </div>
  );
};

export default RateCardForm;

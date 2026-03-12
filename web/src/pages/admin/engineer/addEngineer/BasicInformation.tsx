import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputWithValidation from "@/shared/components/commonUI/inputs/PhoneInputWithValidation";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import {
  validateAddress,
  validateName,
  validatePortfolioLink,
  validatePricePerHour,
  validateZipcode,
} from "@/utils/validate";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";
import type { EngineerFormData } from "../types";

type BasicInformationProps = {
  disableEmail?: boolean;
};

/**
 * BasicInformation component handles the first step of the engineer registration form.
 * It captures essential personal and professional information about the engineer.
 *
 * Form Fields:
 * - Profile Image: Upload functionality for engineer's profile picture
 * - Name: Engineer's full name with validation
 * - Mobile Number: Phone number with international format support
 * - Skills: Technical skills and expertise
 * - Service Category: Dropdown for selecting service specialization
 * - Email Address: Business email with validation
 * - Address: Physical/Business address
 * - Portfolio Link: URL to professional portfolio
 * - Price per/hour: Hourly rate for services
 *
 * @component
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <BasicInformation />
 * </FormProvider>
 * ```
 *
 * @remarks
 * This component must be used within a FormProvider context as it relies on
 * form context for field validation and state management.
 *
 * @returns {JSX.Element} A form section component with basic information fields
 */

export default function BasicInformation({
  disableEmail,
}: BasicInformationProps) {
  const { watch, setValue } = useFormContext<EngineerFormData>();
  const serviceCategoryValue = watch("serviceCategory");
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const { data: skills } = useAppGetLookupData(LookupTable.Skills);
  const { data: serviceCategories } = useAppGetLookupData(
    LookupTable.ServiceCategories,
  );

  const { data: countries } = useAppGetLookupData(LookupTable.Countries);
  const { data: states } = useAppGetLookupData(
    LookupTable.States,
    selectedCountry,
    { enabled: !!selectedCountry },
  );
  const { data: cities } = useAppGetLookupData(
    LookupTable.Cities,
    selectedState,
    {
      enabled: !!selectedState,
    },
  );
  const serviceCategoryOptions = useMemo(() => {
    return (
      serviceCategories?.map((item) => ({
        value: String(item.id),
        label: item.name,
      })) ?? []
    );
  }, [serviceCategories]);

  useEffect(() => {
    if (!serviceCategoryOptions.length) return;
    if (!serviceCategoryValue) return;

    // Normalize numeric values to string ids so SelectField can match options.
    if (typeof serviceCategoryValue === "number") {
      setValue("serviceCategory", String(serviceCategoryValue), {
        shouldDirty: false,
        shouldValidate: false,
      });
      return;
    }

    // EditEngineer GET currently provides serviceCategory as a name; map it to the matching option id.
    if (
      typeof serviceCategoryValue === "string" &&
      isNaN(Number(serviceCategoryValue))
    ) {
      const match = serviceCategoryOptions.find(
        (o) => o.label.toLowerCase() === serviceCategoryValue.toLowerCase(),
      );
      if (!match) return;

      setValue("serviceCategory", match.value, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [serviceCategoryOptions, serviceCategoryValue, setValue]);

  const countryOptions = useMemo(() => {
    return (
      countries?.map((c) => ({ value: String(c.id), label: c.name })) ?? []
    );
  }, [countries]);

  const stateOptions = useMemo(() => {
    return states?.map((s) => ({ value: String(s.id), label: s.name })) ?? [];
  }, [states]);

  const cityOptions = useMemo(() => {
    return cities?.map((c) => ({ value: String(c.id), label: c.name })) ?? [];
  }, [cities]);

  const priceField = (
    <InputField
      name="price"
      label="Price per/hour"
      type="text"
      placeholder="Enter Price per/hour"
      required
      rules={{ validate: (v: string) => validatePricePerHour(v) }}
    />
  );

  return (
    <div>
      <div className="mb-6 mt-2 w-fit">
        <ImageUploaderField label="Profile Image" name="profileImage" />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-2">
          <InputField
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter Name"
            required
            rules={{ validate: (v: string) => validateName(v) }}
          />

          <PhoneInputWithValidation name="phoneNumber" label="Mobile Number" />

          {/* Location */}
          <SelectField
            label="Country"
            name="country"
            placeholder="Select Country"
            options={countryOptions}
            required
            onChange={() => {
              setValue("state", "");
              setValue("city", "");
            }}
          />

          <SelectField
            label="State"
            name="state"
            placeholder="Select State"
            options={stateOptions}
            required
            disabled={!selectedCountry}
            onChange={() => {
              setValue("city", "");
            }}
          />

          <SelectField
            label="City"
            name="city"
            placeholder="Select City"
            options={cityOptions}
            required
            disabled={!selectedState}
          />

          <InputField
            name="postalCode"
            label="Postal Code"
            type="text"
            placeholder="Enter Postal Code"
            required
            rules={{ validate: (v: string) => validateZipcode(v) }}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <InputField
            name="email"
            label="Email Address"
            type="text"
            required
            rules={validateEmailRules}
            disabled={disableEmail}
          />

          <InputField
            name="address"
            label="Address"
            type="text"
            required
            rules={{ validate: (v: string) => validateAddress(v) }}
          />

          <TagSelectField
            name="skills"
            label="Skills"
            placeholder="Add your skills"
            required
            options={
              skills?.map((item) => ({
                value: item.id,
                label: item.name,
              })) ?? []
            }
            maxTags={15}
          />

          {priceField}

          <SelectField
            name="serviceCategory"
            label="Service Category"
            placeholder="Select Category"
            options={serviceCategoryOptions}
            required
          />

          <InputField
            name="portfolio"
            label="Portfolio Link"
            type="text"
            placeholder="Portfolio Link"
            rules={{ validate: (v: string) => validatePortfolioLink(v) }}
          />
        </div>
      </div>
    </div>
  );
}

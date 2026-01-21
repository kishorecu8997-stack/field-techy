import { validateCompany } from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import {
  validateAddress,
  validateName,
  validateVatNumber,
  validateZipcode,
} from "@/pages/engineer/user_profile/Validate";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { PhoneInputWithValidation } from "@/shared/components/commonUI/inputs/PhoneInputWithValidation";
import { useFormContext } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import {
  useIndustries,
  useVatOptions,
} from "@/shared/apiServices/client/clientService";
import { useCities, useCountries, useStates, type LookupItem } from "@/shared/hooks/useLookup";
import { useMemo } from "react";

// TODO: Uncomment when user availability check API is ready for production
// import { useDebouncedUserExists } from "@/shared/apiServices/user";
// import { MdCheckCircle, MdCancel } from "react-icons/md";

/**
 * Email field component with real-time availability validation
 * 
 * NOTE: User availability API is currently commented out.
 * When ready, uncomment the useDebouncedUserExists hook and related UI elements.
 */
import EmailFieldWithValidation from "@/shared/components/commonUI/inputs/EmailFieldWithValidation";


const BasicDetailsFields = () => {
  const ctx = useFormContext();
  const { watch, setValue } = ctx;
  const watchedRole = watch("businessType");
  // Default to URL role if set, otherwise fallback to watched value or "home"
  const urlRole = window.location.pathname.includes("corporate")
    ? "CORPORATE"
    : undefined;
  const role = urlRole || watchedRole || "HOME";

  const country = watch("country");
  const selectedState = watch("state");

  // Fetch dropdown data from API
  const countriesQuery = useCountries();
  const parentCountryId = country?.value ?? country;
  const statesQuery = useStates(parentCountryId);
  const parentStateId = selectedState?.value ?? selectedState;
  const citiesQuery = useCities(parentStateId);

  const countries = useMemo(() => (countriesQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [countriesQuery.data]);
  const states = useMemo(() => (statesQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [statesQuery.data]);
  const cities = useMemo(() => (citiesQuery.data || []).map((i: LookupItem) => ({ value: i.id, label: i.name })), [citiesQuery.data]);

  const statesLoading = statesQuery.isLoading;
  const citiesLoading = citiesQuery.isLoading;

  const { data: industries = [], isLoading: industriesLoading } =
    useIndustries();
  const { data: vatOptions = [], isLoading: vatLoading } = useVatOptions();
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      {/* Account Type Selection (if not fixed by URL) */}
      {!urlRole && (
        <div className="flex gap-2 text-center justify-center mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm dark:border dark:border-[#4a5565] font-medium transition-all duration-200
      ${role === "HOME"
                ? "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-900 border border-teal-300 dark:from-teal-900/30 dark:to-teal-800/30 dark:text-teal-300 dark:border-teal-700"
                : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-900 hover:border hover:border-teal-200 dark:text-gray-400 dark:hover:from-teal-900/20 dark:hover:to-teal-800/20"
              }`}
            onClick={() => setValue("businessType", "HOME")}
          >
            Home Client
          </div>

          <div
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm dark:border dark:border-[#4a5565] font-medium transition-all duration-200
      ${role === "CORPORATE"
                ? "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-900 border border-teal-300 dark:from-teal-900/30 dark:to-teal-800/30 dark:text-teal-300 dark:border-teal-700"
                : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-900 hover:border hover:border-teal-200 dark:text-gray-400 dark:hover:from-teal-900/20 dark:hover:to-teal-800/20"
              }`}
            onClick={() => setValue("businessType", "CORPORATE")}
          >
            Corporate Client
          </div>
        </div>
      )}

      {role === "CORPORATE" ? (
        <>
          <InputField
            required
            name="companyName"
            type="text"
            placeholder="Company Name"
            leftIcon={<FaRegUser className="text-lg text-gray-500" />}
            label="Company Name"
            rules={{ validate: (v: string) => validateCompany(v) }}
          />

          <InputField
            name="contactPersonName"
            type="text"
            placeholder="Contact Person Name"
            leftIcon={<FaRegUser className="text-lg text-gray-500" />}
            required
            label="Contact Person Name"
            rules={{ validate: (v: string) => validateName(v) }}
          />
        </>
      ) : (
        <InputField
          name="fullName"
          type="text"
          placeholder="Full Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
          required
          label="Full Name"
          rules={{ validate: (v: string) => validateName(v) }}
        />
      )}

      {/* Phone and email */}
      <PhoneInputWithValidation />

      <EmailFieldWithValidation />

      {/* Country, state, city, postal */}
      <SelectField
        name="country"
        label="Country"
        placeholder="Select Country"
        options={countries}
        required
      />
      <SelectField
        name="state"
        placeholder={statesLoading ? "Loading states..." : "Select State"}
        options={states}
        required
        label="State"
        disabled={statesLoading || !country}
      />
      <SelectField
        name="city"
        placeholder={citiesLoading ? "Loading cities..." : "Select City"}
        options={cities}
        required
        label="City"
        disabled={citiesLoading || !selectedState}
      />
      <InputField
        name="postalCode"
        type="text"
        placeholder="Postal Code"
        required
        label="Postal Code"
        rules={{
          validate: (value: string) =>
            validateZipcode(
              value,
              typeof country === "string" ? country : country?.value,
            ),
        }}
      />

      {/* Corporate-only fields */}
      {role === "CORPORATE" && (
        <>
          <SelectField
            name="businessType"
            placeholder="Business Type"
            label="Business Type"
            disabled={!!urlRole} // Disable if fixed by URL
            options={[
              { value: "CORPORATE", label: "Corporate" },
              { value: "HOME", label: "Home" },
            ]}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
          />
          <SelectField
            name="industry"
            placeholder={
              industriesLoading ? "Loading industries..." : "Select Industry"
            }
            options={industries}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
            label="Industry"
            disabled={industriesLoading}
          />

          <InputField
            name="address"
            type="text"
            placeholder="Address"
            required
            label="Address"
            rules={{ validate: (v: string) => validateAddress(v) }}
          />

          <SelectField
            name="vat"
            placeholder={
              vatLoading ? "Loading VAT options..." : "Select VAT Document"
            }
            options={vatOptions}
            required
            label="VAT"
            disabled={vatLoading}
          />
          <InputField
            name="vatRegistrationNumber"
            type="text"
            placeholder="VAT Registration Number"
            required
            label="VAT Registration Number"
            rules={{ validate: (v: string) => validateVatNumber(v) }}
          />
        </>
      )}
    </div>
  );
};

export default BasicDetailsFields;

import countries from "@/dummy_data/countries";
import { validateCompany } from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import { validateAddress, validateName, validateVatNumber, validateZipcode } from "@/pages/engineer/user_profile/Validate";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useFormContext } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { useStates, useCities, useIndustries, useVatOptions } from "@/shared/apiServices/client/clientService";

const BasicDetailsFields = () => {
  const ctx = useFormContext();
  const { watch, setValue } = ctx;
  const watchedRole = watch("businessType");
  // Default to URL role if set, otherwise fallback to watched value or "home"
  const urlRole = window.location.pathname.includes("corporate") ? "corporate" : undefined;
  const role = urlRole || watchedRole || "home";

  const country = watch("country");
  const selectedState = watch("state");

  // Fetch dropdown data from API
  const { data: states = [], isLoading: statesLoading } = useStates(country?.value);
  const { data: cities = [], isLoading: citiesLoading } = useCities(selectedState?.value || selectedState);
  const { data: industries = [], isLoading: industriesLoading } = useIndustries();
  const { data: vatOptions = [], isLoading: vatLoading } = useVatOptions();
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      {/* Account Type Selection (if not fixed by URL) */}
      {!urlRole && (
        <div className="flex gap-4 justify-center mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === "home"
              ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            onClick={() => setValue("businessType", "home")}
          >
            Home Owner
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === "corporate"
              ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            onClick={() => setValue("businessType", "corporate")}
          >
            Corporate
          </button>
        </div>
      )}

      {role === "corporate" ? (
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
      <PhoneInputField
        name="phone"
        required
        label="Phone Number"
      />

      <InputField
        name="email"
        type="email"
        placeholder="Email Address"
        required
        label="Email Address"
        rules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        }}
      />

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
        disabled={statesLoading}
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
              typeof country === "string" ? country : country?.value
            ),
        }}
      />


      {/* Corporate-only fields */}
      {role === "corporate" && (
        <>
          <SelectField
            name="businessType"
            placeholder="Business Type"
            label="Business Type"
            disabled={!!urlRole} // Disable if fixed by URL
            options={[
              { value: "corporate", label: "Corporate" },
              { value: "home", label: "Home" },
            ]}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
          />
          <SelectField
            name="industry"
            placeholder={industriesLoading ? "Loading industries..." : "Select Industry"}
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
            placeholder={vatLoading ? "Loading VAT options..." : "Select VAT Document"}
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

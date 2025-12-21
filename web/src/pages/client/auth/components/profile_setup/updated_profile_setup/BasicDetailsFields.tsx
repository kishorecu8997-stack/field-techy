import countries from "@/dummy_data/countries";
import { validateCompany } from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import { validateAddress, validateName, validateVatNumber, validateZipcode } from "@/pages/engineer/user_profile/Validate";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import VerifiedEmailInputField from "@/shared/components/commonUI/inputs/VerifiedEmailInputField";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import { Controller, useFormContext } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import { useStates, useCities, useIndustries, useVatOptions } from "@/shared/apiServices/client/clientService";

const BasicDetailsFields = () => {
  const ctx = useFormContext();
  const role = window.location.pathname.includes("corporate") ? "corporate" : "home";
  const { control, watch } = ctx;

  // Get verification state from store
  const { emailVerified, mobileVerified } = useClientRegistrationStore();

  const country = watch("country");
  const selectedState = watch("state");

  // Fetch dropdown data from API
  const { data: states = [], isLoading: statesLoading } = useStates(country?.value);
  const { data: cities = [], isLoading: citiesLoading } = useCities(selectedState?.value || selectedState);
  const { data: industries = [], isLoading: industriesLoading } = useIndustries();
  const { data: vatOptions = [], isLoading: vatLoading } = useVatOptions();
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
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

      {/* Verified phone and email */}
      <Controller
        name="isMobileVerified"
        control={ctx.control}
        defaultValue={!!mobileVerified}
        render={({ field: { onChange, value } }) => (
          <VerifiedPhoneInputField
            name="phone"
            required
            verified={value}
            setVerified={onChange}
            disabled={value}
          />
        )}
      />

      <Controller
        name="isEmailVerified"
        control={control}
        defaultValue={!!emailVerified}
        render={({ field: { onChange, value } }) => (
          <VerifiedEmailInputField
            name="email"
            required
            verified={value}
            setVerified={onChange}
            disabled={value}
          />
        )}
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
            disabled
            options={[
              { value: "corporate", label: "Corporate" },
              { value: "home", label: "Home" },
            ]}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
            label="Business Type"
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

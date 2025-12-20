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
import { useLocation } from "react-router-dom";

const BasicDetailsFields = () => {
  const ctx = useFormContext();
  const role = window.location.pathname.includes("corporate") ? "corporate" : "home";
  const { control, watch } = ctx;
   const location = useLocation();

  const {
    emailVerified,
    mobileVerified,
    disableEmail = false,
    disableMobile = false,
  } = location.state || {};
  const country = watch("country");
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
            disabled={disableMobile}
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
            disabled={disableEmail}
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
        placeholder="State"
        options={[
          { value: "1", label: "Maharashtra" },
          { value: "2", label: "Manchester" },
        ]}
        required
        label="State"
      />
      <SelectField
        name="city"
        placeholder="City"
        options={[
          { value: "1", label: "Mumbai" },
          { value: "2", label: "London" },
        ]}
        required
        label="City"
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
            options={[
              { value: "1", label: "Corporate" },
              { value: "2", label: "Home" },
            ]}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
            label="Business Type"
          />
          <SelectField
            name="industry"
            placeholder="Industry"
            options={[
              { value: "1", label: "Information Technology" },
              { value: "2", label: "Construction" },
            ]}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
            label="Industry"
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
            placeholder="Tax Document (VAT)"
            options={[
              { value: "1", label: "IE6388047V" },
              { value: "2", label: "ID9488043M" },
            ]}
            required
            label="VAT"
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

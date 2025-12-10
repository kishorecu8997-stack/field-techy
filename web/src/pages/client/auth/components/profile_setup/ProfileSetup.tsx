import { InputField } from "@/shared/components/commonUI/inputs";
import { FaRegUser } from "react-icons/fa";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { TbFileText } from "react-icons/tb";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import VerifiedEmailInputField from "@/shared/components/commonUI/inputs/VerifiedEmailInputField";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  validateAddress,
  validateName,
  validateVatNumber,
  validateZipcode,
} from "@/pages/engineer/user_profile/Validate";
import countries from "@/dummy_data/countries";
import { validateCompany } from "@/pages/engineer/auth/components/profile_setup/profileValidators";

interface ProfileSetupProps {
  role?: string;
}

const ProfileSetup = ({ role }: ProfileSetupProps) => {
  const { control, watch, setValue, trigger } = useFormContext();
  const location = useLocation();

  const {
    signupEmail,
    emailVerified,
    signupPhone,
    mobileVerified,
    disableEmail = false,
    disableMobile = false,
  } = location.state || {};

  const isMobileVerified = watch("isMobileVerified");
  const isEmailVerified = watch("isEmailVerified");
  const country = useWatch({ control, name: "country" });

  useEffect(() => {
    if (signupEmail) setValue("email", signupEmail);
    if (signupPhone) setValue("phone", signupPhone);
    if (emailVerified) setValue("isEmailVerified", true);
    if (mobileVerified) setValue("isMobileVerified", true);
  }, [signupEmail, signupPhone, setValue, emailVerified, mobileVerified]);

  useEffect(() => {
    if (isMobileVerified) trigger("phone");
    if (isEmailVerified) trigger("email");
  }, [isMobileVerified, isEmailVerified, trigger]);

  return (
    <>
      {/* Common Section */}
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 mb-6 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>

      <div className="flex flex-row justify-center items-center">
        <div className="w-fit">
          <ImageUploaderField name="profileImage" />
        </div>
      </div>

      {/* Common Fields */}
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
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
          control={control}
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
    </>
  );
};

export default ProfileSetup;

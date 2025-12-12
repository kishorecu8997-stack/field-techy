import { InputField } from "@/shared/components/commonUI/inputs";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoUnlinkSharp } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import countries from "@/dummy_data/countries";
import {
  validateZipcode,
  validateName,
  validateAddress,
  validateAmount,
  validateCompany,
} from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import {
  validateExperience,
  validateDesignation,
} from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import { validatePortfolioLink } from "@/shared/libs/utils";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import { serviceCategories } from "@/dummy_data/serviceCategories";
import skills from "@/dummy_data/skills";
import { useLocation } from "react-router-dom";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import VerifiedEmailInputField from "@/shared/components/commonUI/inputs/VerifiedEmailInputField";

/**
 * A form component for collecting a user's detailed profile information.
 *
 * This component renders a series of input fields for capturing user details such as
 * name, contact information (with verification), address, skills, and professional
 * experience. It is designed to be used within a `FormProvider` from `react-hook-form`,
 * as it relies on the form context for state management and validation.
 *
 * It also initializes fields like email and phone number from `location.state` if they
 * are passed during navigation from a previous step (e.g., initial sign-up), and
 * handles their pre-verified status accordingly.
 * @returns {JSX.Element} The rendered form fields for the profile setup step.
 */
const ProfileSetup = () => {
  const { control, setValue, trigger, watch } = useFormContext();
  const location = useLocation();
  const {
    signupEmail,
    emailVerified,
    signupPhone,
    mobileVerified,
    disableEmail = false,
    disableMobile = false,
  } = location.state || {};
  const country = useWatch({ control, name: "country" });

  // Use react-hook-form to manage verification state
  const isMobileVerified = watch("isMobileVerified");
  const isEmailVerified = watch("isEmailVerified");

  // Set up the email and phone field on mount / when location.state changes
  useEffect(() => {
    if (signupEmail) setValue("email", signupEmail);
    if (signupPhone) setValue("phone", signupPhone);
    // Initialize verification status in the form state
    if (emailVerified) setValue("isEmailVerified", true);
    if (mobileVerified) setValue("isMobileVerified", true);
  }, [signupEmail, signupPhone, setValue, emailVerified, mobileVerified]);

  // When a field is verified, trigger validation to clear any "must be verified" error.
  useEffect(() => {
    if (isMobileVerified) {
      trigger("phone");
    }
    if (isEmailVerified) {
      trigger("email");
    }
  }, [isMobileVerified, isEmailVerified, trigger]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Basic Details
      </div>
      <InputField
        name="firstname"
        label="First Name"
        type="text"
        placeholder="First Name"
        required
        leftIcon={<FaRegUser className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateName(v, "First Name") }}
      />
      <InputField
        name="lastname"
        label="Last Name"
        type="text"
        placeholder="Last Name"
        required
        leftIcon={<FaRegUser className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateName(v, "Last Name") }}
      />
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

      <InputField
        name="address"
        label="Address"
        type="text"
        placeholder="Address"
        required
        leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAddress(v) }}
      />
      <SelectField
        name="country"
        label="Country"
        placeholder="Select Country"
        options={countries}
        required
      />
      <InputField
        name="postalCode"
        label="Postal Code"
        type="text"
        placeholder="Postal Code"
        required
        leftIcon={<HiOutlineLocationMarker className="text-lg text-gray-500" />}
        rules={{
          validate: (value: string) =>
            validateZipcode(
              value,
              typeof country === "string" ? country : country?.value
            ),
        }}
      />
      <TagSelectField
        name="skills"
        label="Skills"
        placeholder="Add your skills"
        required
        options={skills}
        maxTags={15}
      />
      <InputField
        name="portfolio"
        label="Portfolio Link"
        type="text"
        placeholder="Portfolio Link"
        leftIcon={<IoUnlinkSharp className="text-lg text-gray-500" />}
        //rules={{ validate: (v: string) => validatePortfolio(v, country) }}
        rules={{ validate: (v: string) => validatePortfolioLink(v) }}
      />
      <SelectField
        name="serviceCategory"
        label="Service Category"
        placeholder="Select Category"
        options={serviceCategories}
        required
      />
      <InputField
        name="amount"
        label="Amount"
        type="text"
        placeholder="$50/hr"
        required
        leftIcon={<IoWalletOutline className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAmount(v) }}
      />

      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Experience Details
      </div>
      <InputField
        name="designation"
        label="Current Designation"
        type="text"
        placeholder="Current Designation"
        required
        rules={{ validate: (v: string) => validateDesignation(v) }}
      />
      <InputField
        name="company"
        label="Company/Employer"
        type="text"
        placeholder="Company/Employer"
        required
        rules={{ validate: (v: string) => validateCompany(v) }}
      />
      <InputField
        name="experience"
        label="Experience"
        type="text"
        placeholder="Experience Years"
        required
        rules={{ validate: (v: string) => validateExperience(v) }}
      />
      <FileUpload
        name="resume"
        label="Resume/CV"
        required
        accept=".pdf"
        maxPages={5}
        validatePDF={true}
      />
    </div>
  );
};

export default ProfileSetup;

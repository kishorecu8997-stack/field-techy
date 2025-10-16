import { InputField } from "@/shared/components/commonUI/inputs";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
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
  validatePortfolio,
  validateAmount,
  validateCompany,
} from "@/pages/auth/components/profile_setup/profileValidators";
import {
  validateExperience,
  validateDesignation,
} from "@/pages/auth/components/profile_setup/profileValidators";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import { serviceCategories } from "@/dummy_data/serviceCategories";
import skills from "@/dummy_data/skills";
import { useLocation } from "react-router-dom";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import VerifiedEmailInputField from "@/shared/components/commonUI/inputs/VerifiedEmailInputField";

// Recommended: Place ProfileSetup inside a FormProvider
const ProfileSetup = () => {
  const { control, setValue } = useFormContext();
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

  const [isMobileVerified, setIsMobileVerified] = useState(!!mobileVerified);
  const [isEmailVerified, setIsEmailVerified] = useState(!!emailVerified);
  
  // Set up the email and phone field on mount / when location.state changes
  useEffect(() => {
    if (signupEmail) setValue("email", signupEmail);
    if (signupPhone) setValue("phone", signupPhone);
  }, [signupEmail, signupPhone, setValue]);

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
      <VerifiedPhoneInputField
        name="phone"
        required
        verified={isMobileVerified}
        setVerified={setIsMobileVerified}
        disabled={disableMobile}
      />
      

      <VerifiedEmailInputField
        name="email"
        required
        verified={isEmailVerified}
        setVerified={setIsEmailVerified}
        disabled={disableEmail}
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
        maxTags={10}
      />
      <InputField
        name="portfolio"
        label="Portfolio Link"
        type="text"
        placeholder="Portfolio Link"
        leftIcon={<IoUnlinkSharp className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validatePortfolio(v, country) }}
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

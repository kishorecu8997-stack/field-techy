import { InputField } from "@/shared/components/commonUI/inputs";
import { useFormContext } from "react-hook-form";
import { FaGlobeAsia, FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline, MdWorkOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoUnlinkSharp } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import countries from "@/dummydata/countries";
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
import { CgNotes } from "react-icons/cg";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { serviceCategories } from "@/dummydata/serviceCategories";
import skills from "@/dummydata/skills";

/**
 * Profile Setup form component containing input fields for user profile information.
 * Includes fields for personal details, professional information, and resume upload.
 * Used within the Profile Setting page for collecting user profile data.
 *
 * @component
 * @example
 * return (
 *   <ProfileSetup />
 * )
 *
 * @returns {JSX.Element} The rendered Profile Setup form component with input fields
 */
const ProfileSetup = () => {
  const { getValues } = useFormContext();
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Basic Details *
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
      <PhoneInputField name="phone" label="Phone Number" required />
      <InputField
        name="email"
        label="Email ID"
        type="text"
        required
        leftIcon={<MdOutlineMailOutline className="text-lg text-gray-500" />}
        rules={validateEmailRules}
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
        leftIcon={<FaGlobeAsia className="text-lg text-gray-500" />}
      />
      <InputField
        name="postalCode"
        label="Postal Code/Pin Code"
        type="text"
        placeholder="Postal Code/Pin Code"
        required
        leftIcon={<HiOutlineLocationMarker className="text-lg text-gray-500" />}
        rules={{
          validate: (value: string) =>
            validateZipcode(value, getValues("country") as string),
        }}
      />
      <TagSelectField
        name="skills"
        label="Skills"
        placeholder="Add your skills"
        required
        leftIcon={<CgNotes className="text-lg text-gray-500" />}
        options={skills}
        maxTags={10}
      />
      <InputField
        name="portfolio"
        label="Portfolio Link"
        type="text"
        placeholder="Portfolio Link"
        leftIcon={<IoUnlinkSharp className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validatePortfolio(v) }}
      />
      <SelectField
        name="serviceCategory"
        label="Service Category"
        placeholder="Select Category"
        options={serviceCategories}
        required
        leftIcon={<MdWorkOutline className="text-lg text-gray-500" />}
      />
      <InputField
        name="amount"
        label="Amount"
        type="text"
        placeholder="$50/hr"
        leftIcon={<IoWalletOutline className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAmount(v) }}
      />

      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Experience Details *
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
      <FileUpload name="resume" label="Resume/CV" required accept=".pdf" maxPages={5} validatePDF={true}/>
    </div>
  );
};

export default ProfileSetup;

import { InputField } from "@/shared/components/commonUI/inputs";
import { FaRegUser } from "react-icons/fa";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { TbFileText } from "react-icons/tb";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";

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
  return (
    <>
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
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <InputField
          name="companyName"
          type="text"
          placeholder="Company Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
        />
        <InputField
          name="contactPersonName"
          type="text"
          placeholder="Contact Person Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
        />
        <PhoneInputField name="phoneNumber" />
        <SelectField
          name="businessType"
          placeholder="Business Type"
          options={[
            { value: "1", label: "Option1" },
            { value: "2", label: "Option2" },
          ]}
          leftIcon={<TbFileText className="text-lg text-gray-500" />}
        />
        <SelectField
          name="industry"
          placeholder="Industry"
          options={[
            { value: "1", label: "Option1" },
            { value: "2", label: "Option2" },
          ]}
          leftIcon={<TbFileText className="text-lg text-gray-500" />}
        />
        <InputField name="address" type="text" placeholder="Address" />
        <SelectField
          name="state"
          placeholder="State"
          options={[
            { value: "1", label: "Option1" },
            { value: "2", label: "Option2" },
          ]}
        />
        <SelectField
          name="city"
          placeholder="City"
          options={[
            { value: "1", label: "Option1" },
            { value: "2", label: "Option2" },
          ]}
        />
        <InputField name="postalCode" type="text" placeholder="Postal Code" />
        <SelectField
          name="vat"
          placeholder="Tax Document (VAT)"
          options={[
            { value: "1", label: "Option1" },
            { value: "2", label: "Option2" },
          ]}
        />
        <InputField
          name="vatRegistrationNumber"
          type="text"
          placeholder="VAT Registration Number"
        />
        {/* Experience Details */}
      </div>
    </>
  );
};

export default ProfileSetup;

import { InputField } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { TagInputField } from "@/shared/components/commonUI/inputs/TagInputField";
import { icons } from "@/config/icons";

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
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <InputField
        name="name"
        type="text"
        placeholder="Full Name"
        leftIcon={<icons.user className="text-lg text-gray-500" />}
      />
      <InputField
        name="email"
        type="email"
        placeholder="Enter Email"
        leftIcon={<icons.mail className="text-lg text-gray-500" />}
      />
      <InputField
        name="address"
        type="text"
        placeholder="Address/Location"
        leftIcon={<icons.location className="text-lg text-gray-500" />}
      />
      <TagInputField
        name="tags"
        leftIcon={<icons.notes className="text-lg text-gray-500" />}
      />
      <InputField
        name="portfolio"
        type="text"
        placeholder="Portfolio Link"
        leftIcon={<icons.unlink className="text-lg text-gray-500" />}
      />
      <InputField
        name="amount"
        type="text"
        placeholder="$50/hr"
        leftIcon={<icons.wallet className="text-lg text-gray-500" />}
      />
      {/* Experience Details */}
      <div className="pt-4 text-sm font-medium">
        Experience Details<span className="text-red-600 pl-1">*</span>
      </div>
      <InputField
        name="designation"
        type="text"
        placeholder="Current Designation"
        required
      />
      <InputField name="company" type="text" placeholder="Company/Employer" required/>
      <InputField name="location" type="text" placeholder="Location" required/>
      <InputField
        name="experience"
        type="text"
        placeholder="Experience Years"
        required
      />
      <FileUpload name="resume" label="Resume" required/>
    </div>
  );
};

export default ProfileSetup;

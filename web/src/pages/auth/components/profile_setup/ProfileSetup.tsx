import { InputField } from "@/shared/components/commonUI/inputs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { IoUnlinkSharp } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { TagInputField } from "@/shared/components/commonUI/inputs/TagInputField";
import { CgNotes } from "react-icons/cg";

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
        leftIcon={<FaRegUser className="text-lg text-gray-500" />}
      />
      <InputField
        name="email"
        type="email"
        placeholder="Enter Email"
        leftIcon={<MdOutlineMailOutline className="text-lg text-gray-500" />}
      />
      <InputField
        name="address"
        type="text"
        placeholder="Address/Location"
        leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
      />
      <TagInputField
        name="tags"
        leftIcon={<CgNotes className="text-lg text-gray-500" />}
      />
      <InputField
        name="portfolio"
        type="text"
        placeholder="Portfolio Link"
        leftIcon={<IoUnlinkSharp className="text-lg text-gray-500" />}
      />
      <InputField
        name="amount"
        type="text"
        placeholder="$50/hr"
        leftIcon={<IoWalletOutline className="text-lg text-gray-500" />}
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

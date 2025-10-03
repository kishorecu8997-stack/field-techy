import { InputField } from "@/shared/components/commonUI/inputs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { IoUnlinkSharp } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { TagInputField } from "@/shared/components/commonUI/inputs/TagInputField";
import { CgNotes } from "react-icons/cg";

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
      />
      <InputField name="company" type="text" placeholder="Company/Employer" />
      <InputField name="location" type="text" placeholder="Location" />
      <InputField
        name="experience"
        type="text"
        placeholder="Experience Years"
      />
      <FileUpload name="resume" label="Resume" />
    </div>
  );
};

export default ProfileSetup;

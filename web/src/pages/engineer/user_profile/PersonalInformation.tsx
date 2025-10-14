/**
 * @file PersonalInformation.tsx
 * @description This component provides a form for users to edit their personal information.
 * It includes fields for full name, phone number, email, and address, with validation,
 * and is designed to be displayed within a drawer.
 */
import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import { InputField } from "@/shared/components/commonUI/inputs";
import { CiLocationOn } from "react-icons/ci";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/shared/components/Buttons";
import { validateAddress, validateEmail, validateName } from "./Validate";

/**
 * @typedef {Object} EditProfileFormData
 * @property {string} fullName - The user's full name.
 * @property {string} phoneNumber - The user's phone number.
 * @property {string} emailId - The user's email address.
 * @property {string} addressLocation - The user's physical address.
 */
export type EditProfileFormData = {
  fullName: string;
  phoneNumber: string;
  emailId: string;
  addressLocation: string;
};

/**
 * Props for the PersonalInformation component.
 */
interface PersonalInfoProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * The PersonalInformation component renders a form for editing user profile details.
 * It uses `react-hook-form` for state management and validation.
 * @param {PersonalInfoProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered PersonalInformation form component.
 */
const PersonalInformation: React.FC<PersonalInfoProps> = ({
  onClose,
  onMenuItemClick,
}) => {
  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the user's data.
   * @param {EditProfileFormData} data - The validated form data.
   */
  const handleSubmit = (data: EditProfileFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  /**
   * Initializes `react-hook-form` with default values for the personal information form.
   */
  const methods = useForm<EditProfileFormData>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      emailId: "",
      addressLocation: "",
    },
    mode: "onSubmit",
  });

  return (
    <div className="relative flex flex-col h-screen bg-white">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <DrawerHeader
          title="Personal Information"
          onClose={onClose}
          onBack={() => {
            // When user clicks back, open Add Education view. This will allow returning back to this page
            onMenuItemClick("profile");
          }}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-3">
          {/* Full Name */}
          <InputField
            name="fullName"
            type="text"
            placeholder="Full Name"
            leftIcon={<FaRegUser className="text-lg text-gray-500" />}
            required
            rules={{ validate: (v: string) => validateName(v) }}
          />

          {/* Phone Number */}
          <PhoneInputField name="phoneNumber" required />

          {/* Email */}
          <InputField
            name="emailId"
            type="email"
            placeholder="Enter Email"
            leftIcon={
              <MdOutlineMailOutline className="text-lg text-gray-500" />
            }
            required
            rules={{ validate: (v: string) => validateEmail(v) }}
          />

          {/* Address/Location */}
          <InputField
            name="addressLocation"
            type="text"
            placeholder="Address"
            leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
            required
            rules={{ validate: (v: string) => validateAddress(v) }}
          />
        </div>

        {/* Fixed bottom button */}
        <div className=" bottom-0  p-10 bg-white ">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Edit Profile
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default PersonalInformation;

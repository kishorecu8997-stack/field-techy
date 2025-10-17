import React from "react";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import { InputField } from "@/shared/components/commonUI/inputs";
import { CiLocationOn } from "react-icons/ci";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/shared/components/Buttons";
import { validateAddress, validateEmail, validateName } from "../../Validate";
import type { EditProfileFormData } from "./types";

/**
 * The PersonalInformation component renders a form for editing user profile details.
 * It uses `react-hook-form` for state management and validation.
 * @param {PersonalInfoProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered PersonalInformation form component.
 */
const PersonalInformation: React.FC = ({}) => {
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
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <InputField
          label="Full Name"
          isShowLabel={false}
          name="fullName"
          type="text"
          placeholder="Full Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateName(v) }}
        />
        <PhoneInputField name="phoneNumber" required />
        <InputField
          label="Email Address"
          isShowLabel={false}
          name="emailId"
          type="email"
          placeholder="Enter Email"
          leftIcon={<MdOutlineMailOutline className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateEmail(v) }}
        />
        <InputField
          label="Address Location"
          isShowLabel={false}
          name="addressLocation"
          type="text"
          placeholder="Address"
          leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
          required
          rules={{ validate: (v: string) => validateAddress(v) }}
        />
      </div>
      <div className="bg-white ">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Edit Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export default PersonalInformation;

import { useEffect, useState } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { CiLocationOn } from "react-icons/ci";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import {
  validateAddress,
  validateIsPhoneVerified,
  validateIsVerified,
  validateName,
} from "../../Validate";
import type { EditProfileFormData } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import VerifiedEmailInputField from "@/shared/components/commonUI/inputs/VerifiedEmailInputField";
import { toast } from "react-toastify";
import { loginData, type PersonalInfo } from "@/dummy_data/personalInfoData";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * The PersonalInformation component renders a form for editing user profile details.
 * It uses `react-hook-form` for state management and validation.
 * @param {PersonalInfoProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered PersonalInformation form component.
 */
const PersonalInformation = () => {
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  /**
   * Handles the form submission.
   * This is currently a placeholder. In a real application, this would
   * involve making an API call to save the user's data.
   * @param {EditProfileFormData} data - The validated form data.
   */
  const handleSubmit = async (data: EditProfileFormData) => {
    await showPopup({
      title: "Update Profile",
      body: "Are you sure you want to update your profile?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Profile Updated Successfully");
            console.log("Form submitted with data:", data);
            close(true);
            setActiveKey("profile");
          },
        },
      ],
    });
  };

  const methods = useForm<PersonalInfo>({
    defaultValues: {
      fullName: loginData[0].fullName,
      phoneNumber: loginData[0].phoneNumber,
      emailId: loginData[0].emailId,
      addressLocation: loginData[0].addressLocation,
    },
    mode: "onSubmit",
  });

  const { trigger } = methods;

  useEffect(() => {
    if (isPhoneVerified) {
      trigger("phoneNumber");
    }
  }, [isPhoneVerified, trigger]);

  useEffect(() => {
    if (isEmailVerified) {
      trigger("emailId");
    }
  }, [isEmailVerified, trigger]);

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
          inputMode="string"  
          rules={{ validate: (v: string) => validateName(v) }}
          inputMode="string"
        />

        <VerifiedPhoneInputField
          name="phoneNumber"
          label="Phone Number"
          isShowLabel={false}
          required
          rules={{
            validate: () => validateIsPhoneVerified(isPhoneVerified),
          }}
          verified={isPhoneVerified}
          setVerified={setIsPhoneVerified}
        />

        <VerifiedEmailInputField
          name="emailId"
          label="Email ID"
          isShowLabel={false}
          required
          rules={{
            validate: () => validateIsVerified(isEmailVerified, "Email"),
          }}
          verified={isEmailVerified}
          setVerified={setIsEmailVerified}
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

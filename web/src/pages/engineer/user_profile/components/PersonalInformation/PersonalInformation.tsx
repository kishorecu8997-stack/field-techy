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
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import {
  useEngineerGetById,
  useEngineerUpdateById,
} from "@/shared/apiServices/engineer/engineerService";
import type { EngineerData } from "@/shared/apiServices/engineer/engineerTypes";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

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

  const {
    navigationSource,
    returnToKey,
    setActiveKey,
    setISOpenSidebar,
    resetNavigationSource,
  } = useDrawerStore();

  const { session } = useUserSessionStore();
  const engineerId = session?.userId || "";

  const { data: engineerData, isLoading: isEngineerLoading } =
    useEngineerGetById(engineerId);
  const { mutate } = useEngineerUpdateById(engineerId);

  const methods = useForm<EditProfileFormData>({
    defaultValues: {
      fullName: engineerData?.fullName || "",
      phoneNumber: engineerData?.phoneNumber || "",
      emailId: engineerData?.email || "",
      addressLocation: engineerData?.address || "",
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

  const handleSubmit = async (formData: EditProfileFormData) => {
    // Safety check
    if (!engineerData) {
      toast.error("Unable to load current profile data. Please try again.");
      return;
    }


    const updatedEngineer: EngineerData = {
      ...engineerData, 
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      email: formData.emailId,
      address: formData.addressLocation,
    };

    await showPopup({
      title: "Update Profile",
      body: "Are you sure you want to update your profile?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            mutate(updatedEngineer, {
              onSuccess: () => {
                toast.success("Profile Updated Successfully");
                close(true);

                // Handle navigation
                if (navigationSource === "profilecompletion" && returnToKey) {
                  setActiveKey(returnToKey);
                  setISOpenSidebar(true);
                  resetNavigationSource();
                } else {
                  setActiveKey("profile");
                }
              },
              onError: (error) => {
                console.error("Failed to update profile:", error);
                toast.error("Failed to update profile. Please try again.");
                close(true);
              },
            });
          },
        },
      ],
    });
  };

  // Show loading while fetching current engineer data
  if (isEngineerLoading) {
    return <div>Loading profile data...</div>;
  }

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
          allowedCharacters="string"
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

      <div className="bg-white">
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

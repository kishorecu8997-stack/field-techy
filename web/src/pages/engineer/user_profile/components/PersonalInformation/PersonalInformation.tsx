import {
  useEngineerGetPersonalInfo,
  useEngineerUpdatePersonalInfo,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import VerifiedEmailInputField from "@/shared/components/commonUI/inputs/VerifiedEmailInputField";
import VerifiedPhoneInputField from "@/shared/components/commonUI/inputs/VerifiedPhoneInputField";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEngineerStore } from "@/shared/store/useEngineerStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiLocationOn } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  validateAddress,
  validateIsPhoneVerified,
  validateIsVerified,
  validateName,
} from "../../Validate";
import type { EditProfileFormData } from "./types";

/**
 * The PersonalInformation component renders a form for editing user profile details.
 * It uses `react-hook-form` for state management and validation.
 * @returns {React.ReactElement} The rendered PersonalInformation form component.
 */
const PersonalInformation = () => {
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const { showPopup } = usePopupStore();
  const { refetchProfile } = useEngineerStore();

  const {
    navigationSource,
    returnToKey,
    setActiveKey,
    setISOpenSidebar,
    resetNavigationSource,
  } = useDrawerStore();

  const {
    data: engineerData,
    isLoading: isEngineerLoading,
    refetch: refetchHook,
  } = useEngineerGetPersonalInfo();
  const { mutateAsync: updatePersonalInfo } = useEngineerUpdatePersonalInfo();

  const methods = useForm<EditProfileFormData>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      emailId: "",
      addressLocation: "",
    },
    mode: "onSubmit",
  });

  const { trigger, reset } = methods;

  // Update form values when engineerData is loaded
  useEffect(() => {
    if (engineerData) {
      reset({
        fullName: engineerData.name || "",
        phoneNumber: engineerData.mobileno || "",
        emailId: engineerData.email || "",
        addressLocation: engineerData.address || "",
      });
      // Set verification status if data exists
      setIsPhoneVerified(!!engineerData.mobileno);
      setIsEmailVerified(!!engineerData.email);
    }
  }, [engineerData, reset]);

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
    if (!engineerData) {
      toast.error("Unable to load current profile data. Please try again.");
      return;
    }

    const updatedEngineer = {
      name: formData.fullName,
      mobileno: formData.phoneNumber,
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
          variant: "danger",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              await updatePersonalInfo({ body: updatedEngineer });

              toast.success("Profile Updated Successfully");

              // Refresh both store and local component data
              await refetchProfile();
              await refetchHook();

              close(true);

              // Handle navigation
              if (navigationSource === "profilecompletion" && returnToKey) {
                setActiveKey(returnToKey);
                setISOpenSidebar(true);
                resetNavigationSource();
              } else {
                setActiveKey("profile");
              }
            } catch (error: any) {
              console.error("Failed to update profile:", error);
              toast.error("Failed to update profile. Please try again.");
              close(true);
            }
          },
        },
      ],
    });
  };

  if (isEngineerLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh] w-full">
        <LoaderComponent />
      </div>
    );
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
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition rounded-none"
        >
          Edit Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export default PersonalInformation;

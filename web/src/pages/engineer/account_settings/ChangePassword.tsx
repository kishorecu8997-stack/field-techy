import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { validateIsVerified } from "../user_profile/Validate";
import PasswordOTPVerification from "./PasswordOTPVerification";
import { validatePassword } from "./validation";
import { useUpdatePassword } from "@/shared/apiServices/engineer/engineerService";
import type { UpdatePasswordParams } from "@/shared/apiServices/engineer/engineerTypes";

/**
  * Page component for resetting a user's password via email OTP verification.
 * Collects email, OTP, and a new password, and uses React Hook Form for validation and submission handling.
 */
const ChangePassword = () => {
  const formCtx = useForm<UpdatePasswordParams>({
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: updatePassword } = useUpdatePassword();

  const { setActiveKey } = useDrawerStore();
  const { showPopup } = usePopupStore();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSubmit = async (data: UpdatePasswordParams) => {
    await showPopup({
      title: "Change Password",
      body: "Are you sure you want to change your password?",
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "outline",
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              await updatePassword(data);
              toast.success("Password updated successfully!");
              setActiveKey("settings");
              close(true);
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                "Failed to update password. Please try again.";
              toast.error(errorMessage);
            }
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <div className="flex-1">
        <PasswordOTPVerification
          name="email"
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
          label="OTP"
          name="otp"
          placeholder="Enter your OTP"
          required
          disabled={!isEmailVerified}
          rules={{
            maxLength: {
              value: 6,
              message: "OTP must be between 4 and 6 digits"
            },
            minLength: {
              value: 4,
              message: "OTP must be between 4 and 6 digits"
            },
          }}
        />
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          required
          disabled={!isEmailVerified}
          rules={{ validate: (v: string) => validatePassword(v) }}
        />
        {/* <PasswordSection /> */}
      </div>

      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded w-full"
        >
          Update Password
        </Button>
      </div>
    </FormContainer>
  );
};

export default ChangePassword;

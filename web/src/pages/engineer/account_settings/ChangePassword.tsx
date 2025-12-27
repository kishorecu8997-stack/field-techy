import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PasswordSection from "../auth/components/PasswordSection";
import type { bankDetails } from "./types";
import { validatePassword } from "./validation";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Page component for changing user password, featuring fields for current, new, and confirmed passwords.
 * Uses React Hook Form for validation and submission handling.
 */
const ChangePassword = () => {
  const FormCtx = useForm<bankDetails>();
  const { setActiveKey } = useDrawerStore();
  const { showPopup } = usePopupStore();

  const handleSubmit = async (data: bankDetails) => {
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
              // TODO: Integrate with secure backend API for password update.
              toast.success("Password updated successfully!");
              setActiveKey("settings");
              close(true);
            } catch (error) {
              toast.error("Failed to update password");
              console.error("Error updating password:", error);
            }
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={FormCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <div className="flex-1">
        <PasswordInput
          label="Current Password"
          name="currentPassword"
          placeholder="Enter your current password"
          required
          rules={{ validate: (v: string) => validatePassword(v) }}
        />
        <PasswordSection />
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

import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { validatePassword } from "./validation";
import type { bankDetails } from "./types";
import PasswordSection from "../auth/components/PasswordSection";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Page component for changing user password, featuring fields for current, new, and confirmed passwords.
 * Uses React Hook Form for validation and submission handling.
 */
const ChangePassword = () => {
  return (
    <div className="h-full">
      <ChangePasswordFields />
    </div>
  );
};

export default ChangePassword;

const ChangePasswordFields = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();
  const FormCtx = useForm<bankDetails>();

  const handleSubmit = async(data: bankDetails) => {
await showPopup({
      title: "Change Password",
      body: "Are you sure you want to update the password?",
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
            toast.success("Password Updated Successfully");
            close(true);
            setActiveKey("settings");
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

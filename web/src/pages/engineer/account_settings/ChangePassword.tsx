import {
  useEngineerGetById,
  useUpdatePassword,
} from "@/shared/apiServices/engineer/engineerService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PasswordSection from "../auth/components/PasswordSection";
import { validatePassword } from "./validation";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

/**
 * Page component for changing user password, featuring fields for current, new, and confirmed passwords.
 * Uses React Hook Form for validation and submission handling.
 */
const ChangePassword = () => {
  const FormCtx = useForm<{
    email: string;
    currentPassword: string;
    password: string;
  }>({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      password: "",
    },
  });
  const { setActiveKey } = useDrawerStore();
  const { showPopup } = usePopupStore();

  const session = useUserSessionStore((state) => state.session);
  const userId = session?.userId;

  const { data: sessionData } = useEngineerGetById(userId ?? "", {
    enabled: !!userId,
  });
  const { mutateAsync: updatePassword } = useUpdatePassword();

  const handleSubmit = async (data: {
    currentPassword: string;
    password: string;
  }) => {
    const email = sessionData?.email;
    if (!email) {
      toast.error("User information is not fully loaded. Please wait a moment and try again.");
      return;
    }
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
              await updatePassword({
                phoneOrEmail: email,
                newPassword: data.password,
                oldPassword: data.currentPassword,
              });
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

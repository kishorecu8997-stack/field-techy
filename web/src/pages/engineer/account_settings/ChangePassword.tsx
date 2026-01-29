import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthPasswordSection from "@/shared/components/auth/AuthPasswordSection";
import { validatePassword } from "./validation";
import { useEngineerChangePassword } from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * Page component for changing user password, featuring fields for current, new, and confirmed passwords.
 * Uses React Hook Form for validation and submission handling.
 */
const ChangePassword = () => {
  const FormCtx = useForm<{
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }>({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { setActiveKey } = useDrawerStore();
  const { showPopup } = usePopupStore();
  const { mutateAsync: changePassword } = useEngineerChangePassword();

  const handleSubmit = async (data: {
    currentPassword: string;
    password: string;
  }) => {
    await showPopup({
      title: "Change Password",
      body: "Are you sure you want to change your password?",
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "danger",
          action: async (close) => close(true),
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            try {
              await changePassword({
                body: {
                  oldPassword: data.currentPassword,
                  newPassword: data.password,
                },
                headers: { Authorization: "" },
              });
              toast.success("Password updated successfully!");
              setActiveKey("settings");
              close(true);
            } catch (error) {
              toast.error(
                "Failed to update password. Please check your current password.",
              );
              console.error("Error updating password:", error);
              close(true);
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
        <AuthPasswordSection />
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

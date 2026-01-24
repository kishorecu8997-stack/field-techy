import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import type { ChangePasswordFormData } from "./types";
import { validatePassword } from "@/shared/libs/utils";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useAppChangePassword } from "@/shared/apiServices/admin/adminOpenApiService";
import { AxiosError } from "axios";

/**
 * ChangePassword component renders a form for users to change their password.
 * Utilizes react-hook-form for form state management and validation.
 * Validates old password, new password, and confirmation fields.
 *
 * @component
 */
export default function ChangePassword() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const logout = useUserSessionStore((s) => s.logout);
  const session = useUserSessionStore((s) => s.session);

  const methods = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watch = methods.watch;
  const currentPassword = watch("currentPassword");

  const {
    mutateAsync: adminChangePasswordMutation,
    isPending: isChangingPassword,
  } = useAppChangePassword({
    onSuccess: () => {
      toast.success("Password changed successfully");
      logout();
      navigate(absoluteUrls.admin.home.dashboard);
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        return;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Change Password failed";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: ChangePasswordFormData) => {
    await showPopup({
      title: "Password Change",
      body: "Are you sure you want to change your password?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, change",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            if (isChangingPassword) return;
            await adminChangePasswordMutation({
              body: {
                oldPassword: currentPassword,
                newPassword: data.password,
              },
              token: session?.accessToken || "",
            });
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <PasswordInput
              name="currentPassword"
              label="Old Password"
              required
              rules={{
                required: "Password is required",
                validate: (v: string) => validatePassword(v),
              }}
            />
          </div>

          <div className="flex-1">
            <PasswordInput
              name="password"
              label="New Password"
              required
              rules={{
                required: "Password is required",
                validate: (v: string) => validatePassword(v, currentPassword),
              }}
            />
          </div>

          <div className="flex-1">
            <ConfirmPassword
              name="confirmPassword"
              label="Confirm Password"
              passwordField="password"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            loading={isChangingPassword}
            disabled={isChangingPassword}
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}

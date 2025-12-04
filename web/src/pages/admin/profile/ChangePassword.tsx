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

  const methods = useForm<ChangePasswordFormData>({
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSaveConfirmation = async (data: ChangePasswordFormData) => {
    console.log("data :", data);
    await showPopup({
      title: "Change Password",
      body: "Are you sure you want to change this password?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Password changed successfully!");
            navigate(absoluteUrls.admin.home.dashboard);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = () => {
    handleSaveConfirmation(methods.getValues());
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <PasswordInput
              name="oldPassword"
              label="Old Password"
              required
              rules={{
                required: "Password is required",
                validate: validatePassword,
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
                validate: validatePassword,
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
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}

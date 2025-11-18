import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import type { ChangePasswordFormData } from "./types";
import { validatePassword } from "@/shared/libs/utils";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { toast } from "react-toastify";

/**
 * ChangePassword component renders a form for users to change their password.
 * Utilizes react-hook-form for form state management and validation.
 * Validates old password, new password, and confirmation fields.
 *
 * @component
 */
export default function ChangePassword() {
  const methods = useForm<ChangePasswordFormData>({
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const handleSubmit = () => {
    toast.success("Password Changed Successfully!");
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

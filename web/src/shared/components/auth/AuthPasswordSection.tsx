import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { validatePassword } from "@/shared/libs/utils";
import { useFormContext } from "react-hook-form";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

/**
 * A shared component that groups password and confirm password input fields.
 * Includes an optional password strength meter.
 *
 * @returns {JSX.Element} The rendered section containing the password and confirm password fields.
 */
const AuthPasswordSection = ({
  showStrengthMeter = true,
}: {
  showStrengthMeter?: boolean;
}) => {
  const { watch } = useFormContext();

  // Try to get current password from form context for validation (e.g. in Change Password flow)
  const currentPassword = watch("currentPassword");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <PasswordInput
          name="password"
          label="New Password"
          rules={{
            required: "Password is required",
            validate: (v) => validatePassword(v, currentPassword),
          }}
        />
        <ConfirmPassword
          name="confirmPassword"
          label="Confirm New Password"
          passwordField="password"
          rules={{
            required: "Confirm Password is required",
          }}
        />
      </div>
      {showStrengthMeter && (
        <PasswordStrengthMeter password={watch("password") || ""} />
      )}
    </div>
  );
};

export default AuthPasswordSection;

import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { validatePassword } from "@/shared/libs/utils";
import { useFormContext } from "react-hook-form";

/**
 * Password Section component containing password and confirm password input fields.
 * Provides a secure password input and a confirm password field with validation
 * to ensure both passwords match. Used in forms where password creation is required.
 *
 * @component
 * @example
 * return (
 *   <PasswordSection />
 * )
 *
 * @returns {JSX.Element} The rendered Password Section component with password fields
 */
const PasswordSection = () => {
  const ctx = useFormContext();
  const { watch } = ctx;
  const currentPassword = watch("currentPassword");
  return (
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
        required
      />
    </div>
  );
};

export default PasswordSection;

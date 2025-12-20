import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { useFormContext } from "react-hook-form";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { validatePassword } from "@/shared/libs/utils";

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
  const { watch } = useFormContext();

  //INFO: the key "confirmPassword" should match the key used in the form for this to work
  // please make note of it, update in the form handler or hook resolver of the form if needed
  const confirmPassword = watch("confirmPassword");

  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        name="password"
        label="New Password"
        rules={{
          required: "Password is required",
          validate: (v) => validatePassword(v, confirmPassword),
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
  );
};

export default PasswordSection;

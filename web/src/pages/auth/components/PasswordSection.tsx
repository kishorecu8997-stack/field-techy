import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";

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
  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        name="password"
        label="New Password"
        rules={{
          required: "Password is required",
          validate: (value: string) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters long";
            }
            if (value.length > 20) {
              return "Password must not exceed 20 characters";
            }
            if (!/[a-z]/.test(value)) {
              return "Password must include at least one lowercase letter";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must include at least one uppercase letter";
            }
            if (!/\d/.test(value)) {
              return "Password must include at least one number";
            }
            if (!/[@$!%*?&]/.test(value)) {
              return "Password must include at least one special character (@$!%*?&)";
            }
            return true;
          },
        }}
      />
      <ConfirmPassword
        name="confirmPassword"
        label="Confirm New Password"
        passwordField="password"
      />
    </div>
  );
};

export default PasswordSection;

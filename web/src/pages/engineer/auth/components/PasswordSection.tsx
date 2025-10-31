import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { validatePassword } from "@/shared/libs/utils";

/**
 * A reusable component that groups password and confirm password input fields for creation or updates.
 *
 * This component renders a `PasswordInput` for entering a new password and a `ConfirmPassword`
 * input that validates against the first field to ensure they match. It is designed to be
 * used within a `react-hook-form` `FormProvider` as its child components rely on the form context.
 *
 * @returns {JSX.Element} The rendered section containing the password and confirm password fields.
 */
const PasswordSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        name="password"
        label="New Password"
        rules={{
          required: "Password is required",
          validate: validatePassword,
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

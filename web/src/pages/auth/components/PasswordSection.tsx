import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";

const PasswordSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <PasswordInput name="password" label="New Password" />
      <ConfirmPassword
        name="confirmPassword"
        label="Confirm New Password"
        passwordField="password"
      />
    </div>
  );
};

export default PasswordSection;

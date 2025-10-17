import { Button } from "@/shared/components/commonUI/Buttons";
import { PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";

const ChangePassword = () => {
  return (
    <div className="h-full">
      <ChangePasswordFields />
    </div>
  );
};

export default ChangePassword;

const ChangePasswordFields = () => {
  const FormCtx = useForm();
  const handleSubmit = (data: any) => {
    console.log(data);
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
        />
        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Enter your new password"
        />
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your new password"
        />
      </div>

      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded"
        >
          Update Password
        </Button>
      </div>
    </FormContainer>
  );
};
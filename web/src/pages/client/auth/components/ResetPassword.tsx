import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PasswordSection from "./PasswordSection";

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

/**
 * Type representing the data structure for the Login form.
 * @typedef {Object} LoginFormData
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {boolean} rememberMe - Whether to remember the user.
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const methods = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = () => {    
    navigate(absoluteUrls.client.auth.login);
  };

  return (
    <div className="flex items-center justify-center w-lg">
      <div className=" p-10 w-full ">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img src={assetsConfig.logos.companyLogo} alt="logo" className="h-20 w-24" />
          </div>
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <h2 className="text-md font-extralight ">
            Set your new password below.
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-2"
        >
          <PasswordSection />
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Submit
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default ResetPassword;

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
 * Renders the "Reset Password" form, allowing a user to set a new password.
 *
 * This component is typically accessed after a user has successfully verified
 * their identity (e.g., via OTP from the "Forgot Password" flow). It provides
 * input fields for a new password and its confirmation, leveraging the
 * `PasswordSection` component for the actual input elements.
 *
 * It uses `react-hook-form` for managing the form state and validation.
 * Upon successful submission, the user is navigated to the login page.
 *
 * @returns {JSX.Element} The rendered Reset Password form component.
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
    if (location.pathname.includes("engineer")) {
      navigate(absoluteUrls.engineer.auth.login);
    } else if (location.pathname.includes("client")) {
      navigate(absoluteUrls.client.auth.login);
    }
  };


  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img
              src={assetsConfig.logos.companyLogo}
              alt="logo"
              className="h-20 w-24"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <h2 className="font-light text-gray-600 dark:text-gray-300" >
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

import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import PasswordSection from "@/pages/engineer/auth/components/PasswordSection";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import type { ResetPasswordFormData } from "./types";

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
    navigate(absoluteUrls.admin.auth.login);
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <div className="bg-white dark:text-gray-300 dark:bg-gray-800 items-center mx-4 md:mx-0 rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-5/12 xl:w-1/4">
        <div className="w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <img
                src={assetsConfig.logos.ftLogo}
                alt="logo"
                className="mx-auto mb-2 h-14 w-14 dark:invert dark:brightness-0 dark:filter"
              />
            </div>
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <h2 className="text-md px-8 font-extralight ">
              Enter your password to securely reset your password.
            </h2>
          </div>
          <FormContainer
            methods={methods}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <PasswordSection />
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
              >
                Submit
              </Button>
            </div>
            <div className="text-center mt-2">
              <NavLink
                className="dark:text-teal-400 text-center hover:underline text-sm text-gray-600 underline font-semibold"
                to={absoluteUrls.admin.auth.forget_password}
              >
                Back to Forgot Password
              </NavLink>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

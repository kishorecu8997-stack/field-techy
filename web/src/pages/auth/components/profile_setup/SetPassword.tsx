import { urls } from "@/config/urls";
import {assetsConfig} from "@/assets";
import { Button } from "@/shared/components/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PasswordSection from "../PasswordSection";

export type SetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

/**
 * Set Password form component for creating a new user password.
 * Provides password and confirm password fields with validation.
 * Handles form submission and navigation to login page.
 * 
 * @component
 * @example
 * return (
 *   <SetPassword />
 * )
 * 
 * @returns {JSX.Element} The rendered Set Password form component
 */
const SetPassword = () => {
  const navigate = useNavigate();
  const methods = useForm<SetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = () => {
    navigate(urls.auth.login);
  };

  // Add back navigation handler
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flexed absolute top-6 left-6 md:left-[20rem] lg:left-[40rem] z-10">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img src={assetsConfig.logos.companyLogo} alt="logo" className="h-20 w-24" />
          </div>
          <h2 className="text-3xl font-bold">Set Password</h2>
          <h2 className="text-md font-extralight">
            Please create a secure password for your account for safety reason.
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

export default SetPassword;
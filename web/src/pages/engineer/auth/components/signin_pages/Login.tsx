import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import Popup from "@/shared/components/Popup";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import {
  CheckboxInput,
  InputField,
  PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useHomeNavigation } from "@/shared/hooks/useHomeNavigation";
import { validatePassword } from "@/shared/libs/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import OTPPage from "../OTPPage";
import type { LoginFormData } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";


/**
 * Renders the primary login form for users to sign in with their email and password.
 *
 * This component provides a standard login interface, including fields for email and password,
 * a "Remember me" checkbox, and a link to the "Forgot Password" page. It uses `react-hook-form`
 * for form state management and validation.
 *
 * Upon successful form submission, it displays an OTP modal for two-factor authentication.
 * It also provides UI options to switch to a phone-based login or to use social login providers
 * like LinkedIn.
 *
 * @param {object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - A state setter function
 *   passed from the parent component to toggle the view to the phone number login screen.
 * @returns {JSX.Element} The rendered login form component.
 */
const Login = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { goToHome } = useHomeNavigation();

  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img
              src={assetsConfig.logos.companyLogo}
              alt="logo"
              className="h-20 w-24"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h2>
          <h2 className="text-md font-extralight text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <NavLink
              to={absoluteUrls.engineer.auth.signup}
              className="text-teal-900 dark:text-teal-400 underline font-semibold"
            >
              Sign Up
            </NavLink>
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-2 w-full"
        >
          <InputField
            name="email"
            label="Email ID"
            type="text"
            required
            rules={validateEmailRules}
          />
          <PasswordInput
            name="password"
            label="Password"
            required
            rules={{
              required: "Password is required",
              validate: validatePassword,
            }}
          />
          <div className="flex items-center justify-between flex-wrap">
            <CheckboxInput name="rememberMe" secondaryLabel="Remember me" />
            <NavLink
              className="text-teal-900 dark:text-teal-400 hover:underline font-semibold"
              to={absoluteUrls.engineer.auth.forget_password}
            >
              Forgot Password?
            </NavLink>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 dark:text-gray-300 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(true)}
        >
          <LuPhone className="dark:text-gray-300" />
          Sign in with Phone Number
        </div>
        <div className="flex flex-row items-center justify-center gap-4 pt-5">
          <hr className="flex-1 border-t border-gray-300 dark:border-gray-700" />
          <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center pt-5">
          <Button
            className="w-full dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            variant="outline"
            leftIcon={<BiLogoLinkedin className="text-lg text-blue-400" />}
          >
            <span className="whitespace-nowrap text-gray-900 dark:text-white">
              LinkedIn
            </span>
          </Button>
        </div>
        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header="Enter the OTP"
            description="We sent you an OTP code"
            onClose={() => setIsOpen(false)}
            handleNavigate={goToHome}
          />
        </Popup>
      </div>
    </div>
  );
};

export default Login;

import { urls } from "@/config/urls";
import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/Buttons";
import {
  CheckboxInput,
  InputField,
  PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import type { LoginFormData } from "../types";
import { LuPhone } from "react-icons/lu";
import { BiLogoLinkedin } from "react-icons/bi";
import OTPPage from "../OTPPage";
import Popup from "@/shared/components/Popup";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";

/**
 * Type representing the data structure for the Login form.
 * @typedef {Object} LoginFormData
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {boolean} rememberMe - Whether to remember the user.
 */
const Login = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="p-10 w-full">
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
              to={urls.auth.signUp}
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
          <PasswordInput name="password" label="Password" required />
          <div className="flex items-center justify-between flex-wrap">
            <CheckboxInput name="rememberMe" secondaryLabel="Remember Me" />
            <NavLink
              className="text-teal-900 dark:text-teal-400 hover:underline font-semibold"
              to={urls.auth.forgetPassword}
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
          />
        </Popup>
      </div>
    </div>
  );
};

export default Login;

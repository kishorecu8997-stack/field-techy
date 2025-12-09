import { assetsConfig } from "@/assets";
import logo_light from "@/assets/logo/logo_light.svg";
import { useClientSignin } from "@/shared/apiServices/client/clientService";
import { absoluteUrls } from "@/config/urls";
import IconWithTheme from "@/shared/components/IconWithTheme";
import Popup from "@/shared/components/Popup";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  CheckboxInput,
  InputField,
  PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OTPPage from "../../../../engineer/auth/components/OTPPage";
import type { LoginFormData } from "../../../../engineer/auth/components/types";

/**
 * Type representing the data structure for the Login form.
 * @typedef {Object} LoginFormData
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {boolean} rememberMe - Whether to remember the user.
 */

/**
 * Login component
 *
 * Renders the client sign-in form (email/password) with options to sign in
 * via phone number or LinkedIn. Submitting opens the OTP dialog in this
 * implementation; after OTP success the access popup is shown.
 *
 * Props:
 * @param {{ setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>> }} props - A single prop used to switch to number-based login UI.
 * @returns {JSX.Element} Login form UI
 */
const Login = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useClientSignin({
    onSuccess: (data: any) => {
      console.log(data);
      setIsOpen(true);
      toast.success("OTP sent explicitly (Simulated)");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Login failed");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  /**
   * handleSubmit
   *
   * Called by the form when the user submits credentials. Current behaviour
   * opens the OTP popup (simulating second-factor or phone flow). Real
   * implementations should validate credentials against an API and only
   * open the OTP/modal on success.
   */
  const handleSubmit = (data: LoginFormData) => {
    mutate({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="px-10 w-full max-w-lg ">
        <div className="flex text-center flex-col mb-6 gap-5">
          <div className="flex justify-center ">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={logo_light}
              className="h-20 w-24"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h2>
            <h2 className="text-md font-extralight text-gray-700 dark:text-gray-300">
              Don't have an account?{" "}
              <NavLink
                to={absoluteUrls.client.auth.signup}
                className="text-teal-900 dark:text-teal-400 underline font-semibold "
              >
                Sign Up
              </NavLink>
            </h2>
          </div>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-2 w-full"
        >
          <InputField
            name="email"
            label="Email Address"
            type="email"
            required
          />
          <PasswordInput name="password" label="Password" required />
          <div className="flex items-center justify-between flex-wrap">
            <CheckboxInput name="rememberMe" secondaryLabel="Remember Me" />
            <NavLink
              className="text-teal-900 dark:text-teal-400 hover:underline font-semibold"
              to={absoluteUrls.client.auth.forget_password}
            >
              Forgot Password?
            </NavLink>
          </div>
          <Button
            type="submit"
            loading={isPending}
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
            handleNavigate={() => {
              setIsOpen(false);
              navigate(absoluteUrls.client.home.dashboard);
              toast.success("Logged in successfully");
            }}
          />
        </Popup>
      </div>
    </div>
  );
};

export default Login;

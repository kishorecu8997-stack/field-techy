import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import Popup from "@/shared/components/Popup";
import logo_light from "@/assets/logo/logo_light.svg";
import {
  CheckboxInput,
  InputField,
  PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { validatePassword } from "@/shared/libs/utils";
import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

import type { LoginFormData } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { type LoginEmailFormData } from "../../validations/LoginEmail";
import {
  useUserSessionStore,
  type UserSession,
} from "@/shared/store/useUserSessionStore";
import { useEngineerLogin } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { CiMail } from "react-icons/ci";
import { UserRole } from "@/shared/enums/users";
import { AxiosError } from "axios";
import TwoFASetup from "@/shared/components/TwoFASetup";
import { useTwoFactorAuth } from "@/shared/hooks/useTwoFactorAuth ";
import { getTwoFaStorage } from "@/utils/TwoFAStorage";
import IconWithTheme from "@/shared/components/IconWithTheme";

/**
 * Login component
 *
 * Renders the engineer sign-in form (email/password) with options to sign in
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

  const setUserSession = useUserSessionStore((s) => s.setSession);

  const { mutateAsync: loginMutation, isPending: isLoggingIn } =
    useEngineerLogin({
      onSuccess: async (resp) => {
        if (resp.token) {
          localStorage.setItem("auth_token", resp.token);
        }

        setUserSession({
          accessToken: resp.token,
          userId: "uuid-123", // TODO: Get actual user ID from token or profile response
          role: UserRole.ENGINEER,
          initiatedAt: Date.now(),
        } as UserSession);

        const twoFa = getTwoFaStorage();
        if (twoFa.enabled) {
          triggerTwoFA();
          return;
        }

        navigate(absoluteUrls.engineer.home.dashboard);
        toast.success("Logged in successfully");
      },
      onError: (error) => {
        console.error(error);
        // Skip showing toast for 401 errors as axios interceptor already handles it
        if (error instanceof AxiosError && error.response?.status === 401) {
          return;
        }
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        toast.error(errorMessage);
      },
    });

  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const email = methods.watch("email");
  const {
    isTwoFaOpen,
    setIsTwoFaOpen,
    otpauthUrl,
    handleSubmit: triggerTwoFA,
    verify,
  } = useTwoFactorAuth(email, setUserSession, () => {
    navigate(absoluteUrls.engineer.home.dashboard);
  });

  /**
   * handleSubmit
   */
  const handleSubmit = async (data: LoginEmailFormData) => {
    await loginMutation({
      body: {
        email: data.email,
        password: data.password,
        userRole: UserRole.ENGINEER,
      },
    });
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={logo_light}
              className="h-15 w-20"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h2>
          <h2 className="text-md font-extralight text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <NavLink
              to={absoluteUrls.engineer.auth.signup}
              className="text-teal-900 dark:text-teal-300 underline font-semibold "
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
            // rules={validateEmailRules}
          />
          <PasswordInput
            name="password"
            label="Password"
            required
            rules={{
              required: "Password is required",
              validate: (v) => validatePassword(v),
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
            loading={isLoggingIn}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 dark:text-gray-300 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(true)}
        >
          <CiMail className="dark:text-gray-300 text-lg" />
          Sign In with OTP
        </div>
        {/* <div className="flex flex-row items-center justify-center gap-4 pt-5">
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
        </div> */}

        <Popup open={isTwoFaOpen} onClose={() => setIsTwoFaOpen(false)}>
          <TwoFASetup
            otpauthUrl={otpauthUrl}
            onVerify={verify}
            onClose={() => setIsTwoFaOpen(false)}
          />
        </Popup>
      </div>
    </div>
  );
};

export default Login;

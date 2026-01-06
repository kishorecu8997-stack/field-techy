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
import { validatePassword } from "@/shared/libs/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import OTPPage from "../OTPPage";
import type { LoginFormData } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { type LoginEmailFormData } from "../../validations/LoginEmail";
import {
  useUserSessionStore,
  type UserSession,
} from "@/shared/store/useUserSessionStore";
import {
  useEngineerSignInMutation,
  useReqEmailVerificationOtpMutation,
  useVerifyEmailVerificationOtpMutation,
} from "@/shared/apiServices/auth/engineer/engineerAuthService";
import { CiMail } from "react-icons/ci";
import { UserRole } from "@/shared/enums/users";
import { AxiosError } from "axios";

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

  const engineerSignInMutation = useEngineerSignInMutation();
  const reqEmailVerificationOtpMutation = useReqEmailVerificationOtpMutation();
  const verifyEmailVerificationOtpMutation =
    useVerifyEmailVerificationOtpMutation();
  const setUserSession = useUserSessionStore((s) => s.setSession);

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
  const handleSubmit = async (data: LoginEmailFormData) => {
    await engineerSignInMutation.mutateAsync(
      {
        phoneOrEmail: data.email,
        password: data.password,
      },
      {
        onSuccess: async (resp) => {
          //second layer of verification
          // setIsOpen(true);
          // toast.success("OTP Requested, kindly check your email for OTP");
          console.log(`Login Response: `, resp);
          setUserSession(resp as UserSession);
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
      }
    );
  };

  /**
   * handleOtpSubmission
   * call verifyEmailVerificationOtpMutation to verify the otp
   * @param otp otp code
   */
  const handleOtpSubmission = async (otp: string) => {
    const email = methods.getValues("email");
    await verifyEmailVerificationOtpMutation.mutateAsync(
      { email, otp },
      {
        onSuccess: async (resp) => {
          console.log(`OTP Response: `, resp);
          //TODO: integrate the otp stubbed version
          const stubbedResponse: UserSession = {
            accessToken: "something fake",
            userId: "uuid-123",
            role: UserRole.ENGINEER,
            initiatedAt: Date.now(),
          };

          setIsOpen(false);
          setUserSession(stubbedResponse);
          navigate(absoluteUrls.engineer.home.dashboard);
          toast.success("Logged in successfully");
        },
        onError: (error) => {
          console.error(error);
          toast.error("");
        },
      }
    );
  };

  const onResendOtp = async () => {
    const email = methods.getValues("email");
    await reqEmailVerificationOtpMutation.mutateAsync(email, {
      onSuccess: async (resp) => {
        console.log(`OTP Response: `, resp);
        toast.success("OTP Requested, kindly check your email for OTP");
        setIsOpen(true);
      },
      onError: (error) => {
        console.error(error);
        toast.error("OTP Request failed");
      },
    });
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
            loading={
              engineerSignInMutation.isPending ||
              reqEmailVerificationOtpMutation.isPending
            }
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
        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header="Enter the OTP"
            description="We sent you an OTP code"
            onClose={() => setIsOpen(false)}
            onSubmit={(data) => handleOtpSubmission(data.otp)}
            onResend={onResendOtp}
          />
        </Popup>
      </div>
    </div>
  );
};

export default Login;

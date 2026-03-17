import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import {
  useForgotPassword,
  useResetPassword,
} from "@/shared/apiServices/commonOpenApiService";
import { useToast } from "@/shared/components/commonUI/toastContext.tsx";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import IconWithTheme from "@/shared/components/IconWithTheme";
import AuthPasswordSection from "./AuthPasswordSection";

/**
 * AuthResetPassword component for resetting user passwords.
 *
 * This component provides a form for users (client or engineer) to reset their password
 * using an OTP sent to their email. It handles form validation, submission, and displays
 * success or error messages. On successful password reset, it redirects the user to the
 * appropriate login page based on their role.
 *
 * @component
 * @param {Object} props - Component props
 * @param {"client" | "engineer"} props.role - The user role for which the password is being reset
 * @returns {JSX.Element} The rendered reset password form
 */

export type ResetPasswordFormData = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

interface AuthResetPasswordProps {
  role: "client" | "engineer";
}

const AuthResetPassword = ({ role }: AuthResetPasswordProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const { success, error: toastError } = useToast();

  // Timer state for OTP resend
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const OTP_EXPIRY_SECONDS = 60;

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Start timer on page load since OTP was already sent from forgot password page
  useEffect(() => {
    setTimer(OTP_EXPIRY_SECONDS);
    setCanResend(false);
  }, []);

  const methods = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: email,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, isPending: isResetting } = useResetPassword({
    onSuccess: () => {
      success("Password reset successfully");
      const loginUrl =
        role === "client"
          ? absoluteUrls.client.auth.login
          : absoluteUrls.engineer.auth.login;
      navigate(loginUrl);
    },
    onError: (err: unknown) => {
      toastError(
        GlobalApiErrorHandler.handle(err, "Failed to reset password").message,
      );
    },
  });

  // For resending OTP
  const { mutate: resendOtp, isPending: isResendingOtp } = useForgotPassword({
    onSuccess: () => {
      success("OTP sent to your email address");
      // Start the timer countdown
      setTimer(OTP_EXPIRY_SECONDS);
      setCanResend(false);
    },
    onError: (err: unknown) => {
      toastError(
        GlobalApiErrorHandler.handle(err, "Failed to resend OTP").message,
      );
    },
  });

  const handleResendOtp = () => {
    if (!canResend || isResendingOtp) return;
    resendOtp({
      body: {
        email: methods.getValues("email"),
        userRole: role,
      },
    });
  };

  const handleSubmit = (data: ResetPasswordFormData) => {
    resetPassword({
      body: {
        email: data.email,
        code: data.otp,
        newPassword: data.password,
      },
    });
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.companyLogo}
              darkLogo={assetsConfig.logos.company_logo_white}
              className="h-20 w-24"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <h2 className="font-light text-gray-600 dark:text-gray-300">
            Set your new password below.
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-2"
        >
          <InputField
            name="email"
            label="Email ID"
            type="email"
            required
            disabled
          />

          {/* OTP Field */}
          <InputField
            name="otp"
            label="OTP"
            type="text"
            placeholder="Enter 6-digit OTP"
            required
            maxLength={6}
            allowedCharacters="numbers"
            inputMode="number"
          />

          {/* Timer and Resend Button */}
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-2">
              {timer > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isResendingOtp}
              className="text-sm text-teal-700 dark:text-teal-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isResendingOtp
                ? "Sending..."
                : timer > 0
                  ? "Resend"
                  : "Resend OTP"}
            </button>
          </div>

          <AuthPasswordSection />
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
              loading={isResetting || isResendingOtp}
              disabled={isResetting || isResendingOtp}
            >
              Submit
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default AuthResetPassword;

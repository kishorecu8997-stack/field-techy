import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { useResetPassword } from "@/shared/apiServices/commonOpenApiService";
import { useToast } from "@/shared/components/commonUI/toastContext.tsx";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
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
  const emailFromStorage = sessionStorage.getItem("reset_password_email") || "";
  const otpFromStorage = sessionStorage.getItem("reset_password_otp") || "";
  const email = emailFromStorage || searchParams.get("email") || "";
  const otp = otpFromStorage || searchParams.get("otp") || "";
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (emailFromStorage) {
      sessionStorage.removeItem("reset_password_email");
    }

    if (otpFromStorage) {
      sessionStorage.removeItem("reset_password_otp");
    }
  }, [emailFromStorage, otpFromStorage]);

  const methods = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: email,
      otp: otp,
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetPassword({
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
            <img
              src={assetsConfig.logos.companyLogo}
              alt="logo"
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
          <AuthPasswordSection />
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
              loading={isPending}
              disabled={isPending}
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

import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import type { ForgotPasswordFormData } from "./types";
import { absoluteUrls } from "@/config/urls";
import { useAdminForgotPasswordOtpRequestMutation } from "@/shared/apiServices/admin/adminService";
import { toast } from "react-toastify";

/**
 * ForgotPassword component renders a form for users to request a password reset link.
 * Utilizes react-hook-form for form state management and validation.
 * Navigates to OTP page upon successful submission.
 *
 * @component
 */
export default function ForgotPassword() {
  const methods = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });
  const navigate = useNavigate();

  const requestPasswordOTPMutation = useAdminForgotPasswordOtpRequestMutation();

  const handleSubmit = (data: ForgotPasswordFormData) => {
    requestPasswordOTPMutation.mutate(data.email, {
      onSuccess: (resp) => {
        console.log("resp :", resp);
        toast.success(
          "OTP sent successfully! Please check your email for further instructions."
        );
        navigate(`${absoluteUrls.admin.auth.otp}?email=${data.email}`);
      },
      onError: (error: unknown) => {
        toast.error((error as Error)?.message || "Request failed");
      },
    });
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <div className="bg-white dark:text-gray-300 dark:bg-gray-800 items-center mx-4 md:mx-0 rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-5/12 xl:w-1/4">
        <img
          src={assetsConfig.logos.ftLogo}
          alt="admin_logo"
          className="mx-auto mb-2 h-14 w-14 dark:invert dark:brightness-0 dark:filter"
        />
        <p className="text-xl text-center font-bold">Forgot Your Password?</p>
        <p className="mt-2 px-4 text-gray-500 text-center">
          Don't worry! Just provide your email, and we'll help you reset your
          password.
        </p>

        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-6 w-full"
        >
          <InputField
            name="email"
            label="Email Address"
            type="text"
            required
            rules={validateEmailRules}
          />

          <Button
            type="submit"
            className="mt-2 w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
          <NavLink
            className="dark:text-teal-400 mt-2 mb-4 hover:underline text-sm text-gray-600 mx-auto underline font-semibold"
            to={absoluteUrls.admin.auth.login}
          >
            Back to Login
          </NavLink>
        </FormContainer>
      </div>
    </div>
  );
}

import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { validateOtp, validatePassword } from "@/shared/libs/utils";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { VerifyOtpFormData } from "./types";
import { useAppResetPassword } from "@/shared/apiServices/admin/adminOpenApiService";
import { ConfirmPassword } from "@/shared/components/commonUI/inputs/ConfirmPassword";
import { forgotSession } from "@/shared/store/useUserSessionStore";

/**
 * AdminVerifyOTP component renders a form for entering and verifying a One Time Passcode (OTP).
 * Uses a fixed field name "otp" for simplicity.
 */
export default function AdminVerifyOTP() {
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const forgotToken = forgotSession((s) => s.token);

  const email = searchParams[0].get("email") || navigate(-1);

  const methods = useForm({
    defaultValues: {
      otp: "",
      email: email,
      password: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: adminRewsetPassword, isPending: isResettingPassword } =
    useAppResetPassword();

  const handleSubmit = async (data: VerifyOtpFormData) => {
    try {
      await adminRewsetPassword(
        {
          code: data.otp,
          token: forgotToken.token as string,
          newPassword: data.password,
        },
        {
          onSuccess: () => {
            toast.success(
              "Password reset successfully! You can now log in with your new password.",
            );
            navigate(`${absoluteUrls.admin.auth.login}`);
          },
          onError: (error: unknown) => {
            toast.error((error as Error)?.message || "Request failed");
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Password reset failed");
      }
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <FormContainer
        methods={methods}
        className="bg-white m-4 md:px-6 w-full max-w-md md:mx-auto dark:bg-gray-800 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <p className="text-center my-4 text-2xl dark:text-white">
          Enter the details
        </p>

        <InputField name="email" label="Email Address" type="text" disabled />
        <InputField
          name="otp"
          label="OTP"
          type="text"
          required
          rules={validateOtp}
        />
        <span className="dark:text-gray-500 text-sm">
          Enter the OTP sent to your email
        </span>

        <PasswordInput
          name="password"
          label="New Password"
          required
          rules={{
            required: "Password is required",
            validate: (v) => validatePassword(v, ""),
          }}
        />

        <ConfirmPassword
          name="confirmPassword"
          label="Confirm New Password"
          passwordField="password"
          required
        />
        <Button
          type="submit"
          loading={isResettingPassword}
          disabled={isResettingPassword}
          className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Submit
        </Button>
        <div className="mb-4 text-center">
          <NavLink
            className="dark:text-teal-400 text-center hover:underline text-sm text-gray-600 underline font-semibold"
            to={absoluteUrls.admin.auth.forget_password}
          >
            Back to Forgot Password
          </NavLink>
        </div>
      </FormContainer>
    </div>
  );
}

import { absoluteUrls } from "@/config/urls";
import { useUserPassworResetByOtpMutation } from "@/shared/apiServices/admin/adminService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { validatePassword } from "@/shared/libs/utils";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { VerifyOtpFormData } from "./types";

/**
 * AdminVerifyOTP component renders a form for entering and verifying a One Time Passcode (OTP).
 * Uses a fixed field name "otp" for simplicity.
 */
export default function AdminVerifyOTP() {
  const searchParams = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams[0].get("email") || "";
  const adminPwdResetOtp = useUserPassworResetByOtpMutation();

  const methods = useForm({
    defaultValues: {
      otp: "",
      email: email,
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: VerifyOtpFormData) => {
    adminPwdResetOtp.mutateAsync(
      {
        otp: data.otp,
        phoneOrEmail: data.email,
        password: data.password,
      },
      {
        onSuccess: (resp) => {
          console.log("resp :", resp);
          toast.success(
            "Password reset successfully! You can now log in with your new password."
          );
          navigate(`${absoluteUrls.admin.auth.login}`);
        },
        onError: (error: unknown) => {
          toast.error((error as Error)?.message || "Request failed");
        },
      }
    );
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <FormContainer
        methods={methods}
        className="bg:white m-6 w-full max-w-md mx-auto dark:bg-gray-800 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <p className="text-center my-4 text-2xl dark:text-white">
          Enter the details
        </p>

        <InputField name="email" label="Email Address" type="text" disabled />
        <PasswordInput
          name="password"
          label="Password"
          required
          rules={{
            required: "Password is required",
            validate: (v) => validatePassword(v, ""),
          }}
        />
        <InputField name="otp" label="OTP" type="text" required />
        <span className="dark:text-gray-500 text-sm">
          Enter the OTP sent to your email
        </span>

        <Button
          type="submit"
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

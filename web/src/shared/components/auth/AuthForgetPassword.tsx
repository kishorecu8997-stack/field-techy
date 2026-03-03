import { assetsConfig } from "@/assets";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import { useForgotPassword } from "@/shared/apiServices/commonOpenApiService";
import { useToast } from "@/shared/components/commonUI/toastContext.tsx";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import EngineerOTPPage from "@/pages/engineer/auth/components/OTPPage";
import ClientOTPPage from "@/pages/client/auth/components/OTPPage";
import type { OTPValues } from "@/shared/components/commonUI/inputs/types";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";

export type ForgetPasswordFormData = {
  email: string;
};

interface AuthForgetPasswordProps {
  role: "client" | "engineer";
}

/**
 * A component for forgot password functionality.
 * @param {AuthForgetPasswordProps} props - The props for the AuthForgetPassword component.
 * @param {"client" | "engineer"} props.role - The role of the user.
 * @returns {JSX.Element} The AuthForgetPassword component.
 */

const AuthForgetPassword = ({ role }: AuthForgetPasswordProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });
  const { success, error: toastError } = useToast();

  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => {
      success("OTP sent to your email address");
      setIsOpen(true);
    },
    onError: (err: unknown) => {
      toastError(
        GlobalApiErrorHandler.handle(err, "Failed to send OTP").message,
      );
    },
  });

  const handleSubmit = (data: ForgetPasswordFormData) => {
    forgotPassword({
      body: {
        email: data.email,
        userRole: role,
      },
    });
  };

  const resetUrl =
    role === "client"
      ? absoluteUrls.client.auth.reset_password
      : absoluteUrls.engineer.auth.reset_password;

  const handleOtpSubmit = (otpData: OTPValues) => {
    const otp = otpData?.otp ? otpData.otp : "";

    if (otp) {
      sessionStorage.setItem("reset_password_otp", otp);
    }

    sessionStorage.setItem("reset_password_email", methods.getValues("email"));

    navigate(`${resetUrl}?email=${methods.getValues("email")}`);
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img
              src={assetsConfig.logos.companyLogo}
              alt="logo"
              className="h-16 w-20 sm:h-20 sm:w-24"
            />
          </div>
          <h2 className="text-3xl font-bold">Forgot password</h2>
          <h2 className="text-base font-normal text-gray-700 dark:text-gray-300 ">
            Enter your email address to reset your password.
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col  p-2 gap-10"
        >
          <InputField
            name="email"
            label="Email ID"
            type="text"
            required
            leftIcon={
              <MdOutlineMailOutline className="text-lg text-gray-500" />
            }
            rules={validateEmailRules}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90 transition py-6"
            loading={isPending}
            disabled={isPending}
          >
            Submit
          </Button>
        </FormContainer>

        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          {role === "client" ? (
            <ClientOTPPage
              header="Enter the OTP"
              description="We sent you an OTP code"
              onClose={() => setIsOpen(false)}
              onSubmit={handleOtpSubmit}
            />
          ) : (
            <EngineerOTPPage
              header="Enter the OTP"
              description="We sent you an OTP code"
              onClose={() => setIsOpen(false)}
              onSubmit={handleOtpSubmit}
            />
          )}
        </Popup>
      </div>
    </div>
  );
};

export default AuthForgetPassword;

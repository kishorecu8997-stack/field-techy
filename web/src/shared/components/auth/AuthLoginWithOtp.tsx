import { assetsConfig } from "@/assets";
import OTPPage from "@/pages/engineer/auth/components/OTPPage";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import IconWithTheme from "@/shared/components/IconWithTheme";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoChevronBack } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export type LoginOTPFormData = {
  phone: string;
  otpFor: string;
  email: string;
};

interface AuthLoginWithOtpProps {
  isSending: boolean;
  onSendOtp: (type: "email" | "phoneNumber", value: string) => Promise<void>;
  onVerifyOtp: (
    type: "email" | "phoneNumber",
    value: string,
    otp: string,
  ) => Promise<void>;
  onBackClick: () => void;
  signUpUrl: string;
  logoDark?: string;
}

/**
 * This component is used to login with OTP
 * @param {isSending} - Boolean to check if the user is sending OTP
 * @param {onSendOtp} - Function to handle the OTP send
 * @param {onVerifyOtp} - Function to handle the OTP verify
 * @param {onBackClick} - Function to handle the back click
 * @param {signUpUrl} - URL to the sign up page
 * @param {logoDark} - Logo for the dark mode
 */

export const AuthLoginWithOtp: React.FC<AuthLoginWithOtpProps> = ({
  isSending,
  onSendOtp,
  onVerifyOtp,
  onBackClick,
  signUpUrl,
  logoDark,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const method = useForm<LoginOTPFormData>({
    defaultValues: {
      phone: "",
      otpFor: "email",
      email: "",
    },
  });

  const otpFor = method.watch("otpFor");

  const handleSubmit = async (data: LoginOTPFormData) => {
    const value = data.email || data.phone;
    try {
      await onSendOtp(otpFor as "email" | "phoneNumber", value);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtpSubmission = async (otp: string) => {
    const value = method.getValues("email") || method.getValues("phone");
    try {
      await onVerifyOtp(otpFor as "email" | "phoneNumber", value, otp);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onResendOtp = async () => {
    const value = method.getValues("email") || method.getValues("phone");
    try {
      await onSendOtp(otpFor as "email" | "phoneNumber", value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={logoDark || assetsConfig.logos.ftLogoWhite}
              className="h-15 w-24"
            />
          </div>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <h2 className="text-md font-extralight ">
            Don’t have an account?{" "}
            <NavLink
              to={signUpUrl}
              className="text-teal-900 hover:underline font-semibold dark:text-teal-400"
            >
              Sign Up
            </NavLink>
          </h2>
        </div>
        <FormContainer
          methods={method as any}
          onSubmit={handleSubmit as any}
          className="flex flex-col gap-4 p-2"
        >
          <SelectField
            name="otpFor"
            label="Send OTP Via"
            placeholder="Select One"
            options={[
              { value: "email", label: "Email" },
              { value: "phoneNumber", label: "Phone Number" },
            ]}
            required
          />
          <InputField name="email" label="Email" required />
          <Button
            type="submit"
            loading={isSending}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Send OTP
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row items-center justify-center pt-5 cursor-pointer dark:text-neutral-300"
          onClick={onBackClick}
        >
          <IoChevronBack className="dark:text-gray-300" />
          back
        </div>
        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header={`Verify ${
              otpFor === "phoneNumber" ? "Phone Number" : "Email"
            }`}
            description={`A verification OTP has been sent to your ${
              otpFor === "phoneNumber" ? "phone" : "email"
            }. Please check your ${
              otpFor === "phoneNumber" ? "phone" : "email"
            }.`}
            onClose={() => setIsOpen(false)}
            onSubmit={(data) => handleOtpSubmission(data.otp)}
            onResend={onResendOtp}
          />
        </Popup>
      </div>
    </div>
  );
};

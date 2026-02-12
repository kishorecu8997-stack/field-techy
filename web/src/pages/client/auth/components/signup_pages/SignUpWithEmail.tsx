import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput, InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import ClientOTPPage from "../ClientOTPPage";
import { useSendOtp } from "@/shared/apiServices/client/clientOpenApiService";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import { usePopupStore } from "@/shared/store/popupStore";
import IconWithTheme from "@/shared/components/IconWithTheme";
import type { AppSendOtpData, AppSendOtpResponse } from "@/api";

export interface SignUpFormData {
  email: string;
  terms: boolean;
}

/**
 * Sign-up form component for new client users.
 * Collects the user's email and consent to terms, then triggers an OTP verification flow
 * via a modal popup. Also provides alternative login options:
 * - Switch to phone number login
 * - Continue with LinkedIn
 *
 * Features:
 * - Form validation using `react-hook-form`
 * - Terms & Conditions acceptance enforcement (submit disabled until accepted)
 * - Navigation to Sign In page for existing users
 * - Modal-based OTP verification after form submission
 * - Resume registration flow if user previously started registration
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - Callback to switch to phone-based login flow
 *
 * @example
 * <SignUp setIsNumberLogin={setIsNumberLogin} />
 *
 * @returns {JSX.Element} The sign-up form UI with email input, terms checkbox, and action buttons.
 */
const SignUp = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const logo_light = assetsConfig.logos.companyLogo;

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAskedToContinue, setHasAskedToContinue] = useState(false);

  const { signupEmail, emailVerified, setSignupData, clearStore } =
    useClientRegistrationStore();
  const { showPopup } = usePopupStore();

  const methods = useForm<SignUpFormData>({
    defaultValues: {
      email: "", // Start empty, will be filled based on user choice
      terms: false,
    },
  });

  const { mutate: sendEmailOTP, isPending: isSendingOTP } = useSendOtp({
    onSuccess: (data: AppSendOtpResponse) => {
      console.log("OTP sent successfully:", data);
      setIsOpen(true);
    },
    onError: (error: unknown) => {
      console.error("Failed to send OTP:", error);
      methods.setError("email", {
        type: "manual",
        message: "Failed to send OTP. Please try again.",
      });
    },
  });

  // Ask user if they want to continue with previous registration
  useEffect(() => {
    if (signupEmail && !hasAskedToContinue) {
      setHasAskedToContinue(true);

      showPopup({
        title: emailVerified
          ? "Resume Registration?"
          : "Continue Registration?",
        body: emailVerified
          ? `You have a verified email: ${signupEmail}. Would you like to continue your registration or start fresh?`
          : `You previously started registration with: ${signupEmail}. Would you like to continue or start fresh?`,
        actionButtons: [
          {
            label: "Start Fresh",
            value: false,
            variant: "outline",
            action: (close) => {
              clearStore();
              methods.reset({ email: "", terms: false });
              close(false);
            },
          },
          {
            label: "Continue",
            value: true,
            action: (close) => {
              methods.setValue("email", signupEmail);
              if (emailVerified) {
                // If already verified, redirect to account type
                navigate(absoluteUrls.client.auth.account_type);
              }
              close(true);
            },
          },
        ],
      });
    }
  }, [
    signupEmail,
    emailVerified,
    hasAskedToContinue,
    methods,
    clearStore,
    navigate,
    showPopup,
  ]);

  const handleOTPVerified = () => {
    setIsOpen(false);

    // Save to store instead of location.state
    setSignupData({
      email: methods.getValues("email"),
      emailVerified: true,
    });

    navigate(absoluteUrls.client.auth.account_type);
  };

  const handleResendOTP = () => {
    const email = methods.getValues("email");
    sendEmailOTP({
      body: { type: "email", email } as AppSendOtpData["body"] & { email: string },
      headers: { authorization: "" },
    });
  };

  const termsAccepted = methods.watch("terms");

  const handleSubmit = (data: SignUpFormData) => {
    sendEmailOTP({
      body: { type: "email", email: data.email } as AppSendOtpData["body"] & { email: string },
      headers: { authorization: "" },
    });
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.companyLogo}
              darkLogo={logo_light}
              className="h-20 w-24"
            />
          </div>
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <h2 className="text-md font-extralight">
            Already have an account?{" "}
            <NavLink
              to={absoluteUrls.client.auth.login}
              className="text-teal-900 hover:underline font-semibold"
            >
              Log In
            </NavLink>
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-2"
        >
          <InputField
            name="email"
            label="Email Address"
            type="email"
            required
          />
          <div className="flex items-center w-full flex-col md:flex-row">
            <CheckboxInput
              name="terms"
              secondaryLabel="I have read and agree to the"
            />
            <NavLink
              className="text-teal-900 underline font-semibold pl-1"
              to={absoluteUrls.client.auth.signup}
            >
              Terms and Services
            </NavLink>
          </div>
          <Button
            type="submit"
            disabled={!termsAccepted || isSendingOTP}
            className={`w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg transition ${!termsAccepted || isSendingOTP
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90"
              }`}
          >
            {isSendingOTP ? "Sending OTP..." : "Create Account"}
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(true)}
        >
          <LuPhone />
          Sign up with Phone Number
        </div>
        <div className="flex flex-row items-center justify-center gap-4 pt-5">
          <hr className="flex-1 border-t border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-t border-gray-300" />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center pt-5">
          <Button
            className="w-full"
            variant="outline"
            leftIcon={<BiLogoLinkedin className="text-lg text-blue-400" />}
          >
            <span className="whitespace-nowrap">LinkedIn</span>
          </Button>
        </div>
        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <ClientOTPPage
            header="Enter the OTP"
            description="We sent you an OTP code to your email"
            onClose={() => setIsOpen(false)}
            handleNavigate={handleOTPVerified}
            verificationType="email"
            contact={methods.getValues("email")}
            onResendOTP={handleResendOTP}
          />
        </Popup>
      </div>
    </div>
  );
};

export default SignUp;

import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { CheckboxInput, InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import EngineerOTPPage from "../EngineerOTPPage";
import { useSendEmailOTP } from "@/shared/apiServices/engineer/engineerService";
import IconWithTheme from "@/shared/components/IconWithTheme";

export interface SignUpFormData {
  email: string;
  terms: boolean;
}

/**
 * Renders a sign-up form for users to register with their email address.
 *
 * This component captures the user's email and their agreement to the terms and conditions.
 * Upon submission, it initiates an OTP verification process. If the OTP is verified
 * successfully, it navigates the user to the profile setup page, passing along the
 * verified email address.
 *
 * It also provides options to switch to a phone-based sign-up or to use social
 * providers like LinkedIn.
 *
 * @param {object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - A state setter function
 *   passed from the parent to toggle the view to the phone number sign-up screen.
 * @returns {JSX.Element} The rendered email sign-up form.
 */
const SignUpWithEmail = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      terms: false,
    },
  });

  // Send Email OTP mutation
  const { mutate: sendEmailOTP, isPending: isSendingOTP } = useSendEmailOTP({
    onSuccess: (data) => {
      console.log("OTP sent successfully:", data);
      setIsOpen(true);
    },
    onError: (error) => {
      console.error("Failed to send OTP:", error);
      methods.setError("email", {
        type: "manual",
        message: "Failed to send OTP. Please try again.",
      });
    },
  });

  // Inside handleOTPVerified in SignUp
  const handleOTPVerified = () => {
    setIsOpen(false);
    // navigate(absoluteUrls.engineer.auth.profile_setup, {
    navigate(absoluteUrls.engineer.auth.updated_basic_details, {
      state: {
        signupEmail: methods.getValues("email"),
        emailVerified: true, // Pre-verified
        disableEmail: true, // Lock email in ProfileSetup
        disableMobile: false, // Mobile should be editable in ProfileSetup
      },
    });
  };

  const handleResendOTP = () => {
    const email = methods.getValues("email");
    sendEmailOTP(email);
  };

  const termsAccepted = methods.watch("terms");

  const handleSubmit = (data: SignUpFormData) => {
    sendEmailOTP(data.email);
  };

  const logo_light = assetsConfig.logos.ftLogo;

  return (
    <div className="flex items-center justify-center w-full">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={logo_light}
              className="h-20 w-24"
            />
          </div>
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <h2 className="text-md font-extralight">
            Already have an account?{" "}
            <NavLink
              to={absoluteUrls.engineer.auth.login}
              className="text-teal-900 hover:underline font-semibold dark:text-teal-400"
            >
              Sign In
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
            label="Email ID"
            type="text"
            required
            leftIcon={
              <MdOutlineMailOutline className="text-lg text-gray-500" />
            }
            rules={validateEmailRules}
          />
          <div className="flex items-center w-full flex-col md:flex-row">
            <CheckboxInput
              name="terms"
              secondaryLabel="I have read and agree to the"
            />
            <NavLink
              className="text-teal-900 underline font-semibold pl-1 dark:text-teal-400"
              to={absoluteUrls.engineer.auth.signup}
            >
              Terms and Conditions
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
          className="dark:text-neutral-300 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(true)}
        >
          <LuPhone />
          Sign up with Mobile Number
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
          <EngineerOTPPage
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

export default SignUpWithEmail;

import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import { detectAndStoreCurrency, getCurrencyFromStorage, detectCurrencyFromPhone } from "@/utils/currency";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import OTPPage from "../OTPPage";

export type LoginFormData = {
  phone: string;
  terms: boolean;
};

/**
 * Renders a sign-up form for users to register with their phone number.
 *
 * This component captures the user's phone number and their agreement to the terms and conditions.
 * Upon submission, it initiates an OTP verification process. If the OTP is verified
 * successfully, it navigates the user to the profile setup page, passing along the
 * verified phone number.
 *
 * It also provides options to switch to an email-based sign-up or to use social
 * providers like LinkedIn.
 *
 * @param {object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - A state setter function
 *   passed from the parent to toggle the view to the email sign-up screen.
 * @returns {JSX.Element} The rendered phone number sign-up form.
 */
const SignUpWithNumber = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const method = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      terms: false,
    },
  });
  const handleOTPVerified = () => {
    const phoneNumber = method.getValues("phone");
    console.log("=== SIGNUP OTP VERIFIED ===");
    console.log("Raw phone number from form:", phoneNumber);
    console.log("Phone number type:", typeof phoneNumber);
    console.log("Phone number length:", phoneNumber?.length);

    // Test the detection
    const detectedCurrency = detectCurrencyFromPhone(phoneNumber);
    console.log("Detected currency:", detectedCurrency);

    detectAndStoreCurrency(phoneNumber);
    const storedCurrency = getCurrencyFromStorage();
    console.log("Currency stored in localStorage:", storedCurrency);

    setIsOpen(false);
    navigate(absoluteUrls.engineer.auth.profile_setup, {
      state: {
        signupPhone: phoneNumber,
        mobileVerified: true,
        disableMobile: true, // Lock mobile in ProfileSetup
        disableEmail: false, // Email should be editable in ProfileSetup
      },
    });
  };

  const termsAccepted = method.watch("terms");

  const handleSubmit = (data: LoginFormData) => {
    console.log(data, "data from Login Form");
    setIsOpen(true);
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
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <h2 className="text-md font-extralight">
            Already have an account?{" "}
            <NavLink
              to={absoluteUrls.engineer.auth.login}
              className="text-teal-900 hover:underline font-semibold"
            >
              Sign In
            </NavLink>
          </h2>
        </div>
        <FormContainer
          methods={method}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-2"
        >
          <PhoneInputField name="phone" label="Mobile Number" required />
          <div className="flex items-center w-full">
            <CheckboxInput
              name="terms"
              secondaryLabel="I have read and agree to the"
            />
            <NavLink
              className="text-teal-900 underline font-semibold pl-1"
              to={absoluteUrls.engineer.auth.signup}
            >
              Terms and Conditions
            </NavLink>
          </div>
          <Button
            type="submit"
            disabled={!termsAccepted}
            className={`w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg transition ${
              !termsAccepted
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            Create Account
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(false)}
        >
          <LuPhone />
          Sign up with Email ID
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
          <OTPPage
            header="Enter the OTP"
            description="We sent you an OTP code"
            onClose={() => setIsOpen(false)}
            handleNavigate={handleOTPVerified}
          />
        </Popup>
      </div>
    </div>
  );
};

export default SignUpWithNumber;

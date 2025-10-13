import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
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
 * Phone-based sign-up form that collects a phone number and terms acceptance,
 * then triggers OTP verification via modal. Includes toggle to email sign-up
 * and LinkedIn alternative.
 *
 * @param {Object} props
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - Toggles between phone/email sign-up flows
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
            <img src={assetsConfig.logos.companyLogo} alt="logo" className="h-20 w-24" />
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
              !termsAccepted ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
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
          Sign in with Email ID
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
            header="Verify Mobile Number"
            description="A verification OTP has been sent to your mobile. Please check your mobile."
            onClose={() => setIsOpen(false)}
            handleNavigate={() => navigate(absoluteUrls.engineer.auth.profile_setup)}
          />
        </Popup>
      </div>
    </div>
  );
};

export default SignUpWithNumber;

import { urls } from "@/config/urls";
import {assetsConfig} from "@/assets";
import { Button } from "@/shared/components/Buttons";
import { CheckboxInput, InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import OTPPage from "../OTPPage";

export interface SignUpFormData {
  email: string;
  terms: boolean;
}

const SignUp = ({
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

  const termsAccepted = methods.watch("terms");

  const handleSubmit = () => {
        setIsOpen(true);
  };

  return (
    <div className="flex items-center justify-center max-w-lg">
      <div className="p-10 w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img src={assetsConfig.logos.companyLogo} alt="logo" className="h-20 w-24" />
          </div>
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <h2 className="text-md font-extralight">
            Already have an account?{" "}
            <NavLink
              to={urls.auth.login}
              className="text-teal-900 hover:underline font-semibold"
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
          <InputField name="email" label="Email Address" type="email" required />
          <div className="flex items-center w-full flex-col md:flex-row">
            <CheckboxInput
              name="terms"
              secondaryLabel="I have read and agree to the"
            />
            <NavLink
              className="text-teal-900 underline font-semibold pl-1"
              to={urls.auth.signUp}
            >
              Terms and Services
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
          onClick={() => setIsNumberLogin(true)}
        >
          <LuPhone />
          Sign in with Phone Number
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
            handleNavigate={() => navigate(urls.auth.profile_setup)}
          />
        </Popup>
      </div>
    </div>
  );
};

export default SignUp;

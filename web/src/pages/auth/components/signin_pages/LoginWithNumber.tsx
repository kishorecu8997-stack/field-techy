import { Button } from "@/shared/components/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import {assetsConfig} from "@/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { urls } from "@/config/urls";
import OTPPage from "../OTPPage";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { MdEmail } from "react-icons/md";

export type LoginFormData = {
  phone: string;
};

/**
 * Login with phone number component that allows users to sign in using their phone number.
 * Provides phone input field, OTP verification, and alternative login options.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - Function to toggle between phone and email login
 * @example
 * return (
 *   <LoginWithNumber setIsNumberLogin={setIsNumberLogin} />
 * )
 *
 * @returns {JSX.Element} The rendered Login with Number form component
 */
const LoginWithNumber = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const method = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
    },
  });

  const handleSubmit = () => {    
    setIsOpen(true);
  };
  return (
    <div className="flex items-center justify-center max-w-lg">
      <div className=" p-10 w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img src={assetsConfig.logos.companyLogo} alt="logo" className="h-20 w-24" />
          </div>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <h2 className="text-md font-extralight ">
            Don’t have an account?{" "}
            <NavLink
              to={urls.auth.signUp}
              className="text-teal-900 hover:underline font-semibold"
            >
              Sign Up
            </NavLink>
          </h2>
        </div>
        <FormContainer
          methods={method}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-2"
        >
          <PhoneInputField name="phone" label="Phone Number" required/>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Send OTP
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(false)}
        >
          <MdEmail />
          Sign in with Email
        </div>
        <div className="flex flex-row items-center justify-center gap-4 pt-5">
          <hr className="flex-1 border-t border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-t border-gray-300" />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center pt-5">
          <Button
            className="w-full "
            variant="outline"
            leftIcon={<BiLogoLinkedin className="text-lg text-blue-400" />}
          >
            <span className="whitespace-nowrap">LinkedIn</span>
          </Button>
        </div>
        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header="Verify Phone Number"
            description="A verification OTP has been sent to your phone. Please check your phone."
            onClose={() => setIsOpen(false)}
            handleNavigate={() => navigate(urls.main.home)}
            
          />
        </Popup>
      </div>
    </div>
  );
};

export default LoginWithNumber;

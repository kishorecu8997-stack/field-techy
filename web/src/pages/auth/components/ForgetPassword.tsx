import logo from "@/pages/assets/logo.png";
import { Button } from "@/shared/components/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import OTPPage from "./OTPPage";
import { urls } from "@/config/urls";

export type ForgetPasswordFormData = {
  email: string;
};

/**
 * Type representing the data structure for the Login form.
 * @typedef {Object} LoginFormData
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {boolean} rememberMe - Whether to remember the user.
 */
const ForgetPassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: ForgetPasswordFormData) => {
    console.log(data, "data from Login Form");
    setIsOpen(true);
  };

  return (
    <div className="flex items-center justify-center w-lg">
      <div className=" p-10 w-full ">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-20 w-24" />
          </div>
          <h2 className="text-3xl font-bold">Forgot password</h2>
          <h2 className="text-md font-extralight ">
            Enter your email address to reset your password.
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col  p-2 gap-10"
        >
          <InputField name="email" label="Email Address" type="email" />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90 transition py-6"
          >
            Submit
          </Button>
        </FormContainer>

        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header="Enter the OTP"
            description="We sent you an OTP code"
            onClose={() => setIsOpen(false)}
            handleNavigate={() => navigate(urls.auth.resetPassword)}
          />
        </Popup>
      </div>
    </div>
  );
};

export default ForgetPassword;

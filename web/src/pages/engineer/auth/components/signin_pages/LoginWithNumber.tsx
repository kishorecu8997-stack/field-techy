import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import {
  detectAndStoreCurrency,
  getCurrencyFromStorage,
} from "@/utils/currency";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import OTPPage from "../OTPPage";
import { toast } from "react-toastify";
import IconWithTheme from "@/shared/components/IconWithTheme";
import logo_light from "@/assets/logo/logo_light.svg";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { InputField } from "@/shared/components/commonUI/inputs";
import {
  useRequestVerificationOtpMutation,
  useVerifyOtpMutation,
} from "@/shared/apiServices/auth/engineer/engineerAuthService";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { IoChevronBack } from "react-icons/io5";

export type LoginFormData = {
  phone: string;
  otp: string;
  email: string;
};

/**
 * Renders a login form that allows users to sign in using their phone number.
 *
 * This component provides an input field for the phone number, a "Send OTP" button
 * to initiate the verification process, and a popup for OTP entry. It also offers
 * options to switch to email-based login or use social login providers like LinkedIn.
 *
 * @param {object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsNumberLogin - A state setter function
 *   passed from the parent component to toggle the view to the email login screen.
 * @returns {JSX.Element} The rendered phone number login form component.
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
      otp: "",
      email: "",
    },
  });
  const otpfor = method.watch("otp");
  const setUserSession = useUserSessionStore((s) => s.setSession);
  const [requestData, setRequestData] = useState<string | undefined>();

  const verifyRequestOTP = useRequestVerificationOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const handleSubmit = async (data: LoginFormData) => {
    const value = data.email ? data.email : data.phone;
    console.log("value :", value);
    setRequestData(value);

    await verifyRequestOTP.mutateAsync(value, {
      onSuccess: async (resp) => {
        console.log(`OTP Response: `, resp);
        toast.success("OTP Requested, kindly check your phone for OTP");
        setIsOpen(true);
      },
      onError: async (error) => {
        console.log(`OTP Response: `, error);
        const errorMessage =
          error instanceof Error ? error.message : "OTP Request failed";
        toast.error(errorMessage);
      },
    });
  };

  //OTP Verification
  const handleOtpSubmission = async (otp: string) => {
    await verifyOtpMutation.mutateAsync(
      {
        phoneOrEmail: requestData as string,
        otp,
      },
      {
        onSuccess: (response) => {
          setIsOpen(false);
          setUserSession(response);

          console.log("Respone Engineer: ", response);
          navigate(absoluteUrls.engineer.home.dashboard);
          toast.success("Logged in successfully");
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "OTP Verification failed";
          toast.error(errorMessage);
        },
      },
    );
  };
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
          <h2 className="text-3xl font-bold">Sign In</h2>
          <h2 className="text-md font-extralight ">
            Don’t have an account?{" "}
            <NavLink
              to={absoluteUrls.engineer.auth.signup}
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
          <SelectField
            name="otp"
            label="Send OTP Via"
            placeholder="Select One"
            options={[
              { value: "phoneNumber", label: "Phone Number" },
              { value: "email", label: "Email" },
            ]}
            required
          />

          {otpfor === "phoneNumber" && (
            <PhoneInputField name="phone" label="Phone Number" required />
          )}
          {otpfor === "email" && (
            <InputField name="email" label="Email" required />
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Send OTP
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer dark:text-neutral-300"
          onClick={() => setIsNumberLogin(false)}
        >
          <IoChevronBack className="dark:text-gray-300" />
          Back
        </div>

        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header={`Verify ${
              otpfor === "phoneNumber" ? "Phone Number" : "Email"
            }`}
            description={`A verification OTP has been sent to your ${
              otpfor === "phoneNumber" ? "phone" : "email"
            }. Please check your ${
              otpfor === "phoneNumber" ? "phone" : "email"
            }.`}
            onClose={() => setIsOpen(false)}
            onSubmit={(data) => {
              handleOtpSubmission(data.otp);
              const phoneNumber = method.getValues("phone");
              detectAndStoreCurrency(phoneNumber);
              getCurrencyFromStorage();
              toast.success("Logged in successfully");
            }}
          />
        </Popup>
      </div>
    </div>
  );
};

export default LoginWithNumber;

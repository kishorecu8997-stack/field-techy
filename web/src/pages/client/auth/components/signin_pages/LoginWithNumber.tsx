import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import OTPPage from "../../../../engineer/auth/components/OTPPage";
import { toast } from "react-toastify";
import logo_light from "@/assets/logo/logo_light.svg";
import IconWithTheme from "@/shared/components/IconWithTheme";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import {
  useReqMobileVerificationOtpMutation,
  useRequestVerificationOtpMutation,
  useVerifyOtpMutation,
} from "@/shared/apiServices/auth/clients/clientAuthService";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { InputField } from "@/shared/components/commonUI/inputs";
import { IoChevronBack } from "react-icons/io5";

export type LoginFormData = {
  phone: string;
  otp: string;
  email: string;
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
  const reqMobileVerificationOtpMutation =
    useReqMobileVerificationOtpMutation();
  const setUserSession = useUserSessionStore((s) => s.setSession);

  const requestVerificationOtpMutation = useRequestVerificationOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [requestData, setRequestData] = useState<string | undefined>();
  const method = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      otp: "",
      email: "",
    },
  });

  const otpfor = method.watch("otp");

  const handleSubmit = async (data: LoginFormData) => {
    const value = data.email ? data.email : data.phone;
    setRequestData(value);

    await requestVerificationOtpMutation.mutateAsync(value, {
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
          navigate(absoluteUrls.client.home.dashboard);
          toast.success("Logged in successfully");
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "OTP Verification failed";
          toast.error(errorMessage);
        },
      }
    );
  };

  const onResendOtp = async () => {
    const phone = method.getValues("phone");
    await reqMobileVerificationOtpMutation.mutateAsync(phone, {
      onSuccess: async (resp) => {
        console.log(`OTP Response: `, resp);
        toast.success("OTP Requested, kindly check your phone for OTP");
        setIsOpen(true);
      },
      onError: (error) => {
        console.error(error);
        toast.error("OTP Request failed");
      },
    });
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.companyLogo}
              darkLogo={logo_light}
              className="h-20 w-24"
            />
          </div>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <h2 className="text-md font-extralight ">
            Don’t have an account?{" "}
            <NavLink
              to={absoluteUrls.client.auth.signup}
              className="text-teal-900 hover:underline font-semibold dark:text-teal-400"
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
            loading={reqMobileVerificationOtpMutation.isPending}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Send OTP
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row items-center justify-center pt-5 cursor-pointer dark:text-neutral-300"
          onClick={() => setIsNumberLogin(false)}
        >
          <IoChevronBack className="dark:text-gray-300" />
          back
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
            onSubmit={(data) => handleOtpSubmission(data.otp)}
            onResend={onResendOtp}
          />
        </Popup>
      </div>
    </div>
  );
};

export default LoginWithNumber;

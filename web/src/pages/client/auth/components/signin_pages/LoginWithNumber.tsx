import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { PhoneInputField } from "@/shared/components/commonUI/inputs/PhoneInputField";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoLinkedin } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import OTPPage from "../../../../engineer/auth/components/OTPPage";
import { toast } from "react-toastify";
import logo_light from "@/assets/logo/logo_light.svg";
import IconWithTheme from "@/shared/components/IconWithTheme";
import { useUserSessionStore, type UserSession } from "@/shared/store/useUserSessionStore";
import { useReqMobileVerificationOtpMutation, useVerifyMobileVerificationOtpMutation } from "@/shared/apiServices/auth/clients/clientAuthService";

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
  const reqMobileVerificationOtpMutation = useReqMobileVerificationOtpMutation();
  const verifyMobileVerificationOtpMutation = useVerifyMobileVerificationOtpMutation();
  const setUserSession = useUserSessionStore(s => s.setSession);

  const [isOpen, setIsOpen] = useState(false);
  const method = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    await reqMobileVerificationOtpMutation.mutateAsync(data.phone, {
      onSuccess: async (resp) => {
        console.log(`OTP Response: `, resp)
        toast.success("OTP Requested, kindly check your phone for OTP");
        setIsOpen(true);
      },
      onError: (error) => {
        console.error(error);
        toast.error("OTP Request failed");
      },
    })
  };

  const handleOtpSubmission = async (otp: string) => {
    const phone = method.getValues("phone");
    await verifyMobileVerificationOtpMutation.mutateAsync({ mobile: phone, otp }, {
      onSuccess: async (resp) => {
        console.log(`OTP Response: `, resp)
        //TODO: integrate the otp stubbed version
        const stubbedResponse: UserSession = {
          accessToken: "something fake",
          userId: "uuid-123",
          displayName: "John Doe",
          metadata: {}
        }

        setIsOpen(false);
        setUserSession(stubbedResponse);
        navigate(absoluteUrls.client.home.dashboard);
        toast.success("Logged in successfully");
      },
      onError: (error) => {
        console.error(error);
        toast.error("OTP Verification failed");
      },
    })
  }

  const onResendOtp = async () => {
    const phone = method.getValues("phone");
    await reqMobileVerificationOtpMutation.mutateAsync(phone, {
      onSuccess: async (resp) => {
        console.log(`OTP Response: `, resp)
        toast.success("OTP Requested, kindly check your phone for OTP");
        setIsOpen(true);
      },
      onError: (error) => {
        console.error(error);
        toast.error("OTP Request failed");
      },
    })
  }

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
          <PhoneInputField name="phone" label="Phone Number" required />

          <Button
            type="submit"
            loading={reqMobileVerificationOtpMutation.isPending}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Send OTP
          </Button>
        </FormContainer>
        <div
          className="text-gray-900 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer dark:text-neutral-300"
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
            className="w-full"
            variant="outline"
            disabled
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
            onSubmit={(data) => handleOtpSubmission(data.otp)}
            onResend={onResendOtp}
          />
        </Popup>
      </div>
    </div>
  );
};

export default LoginWithNumber;

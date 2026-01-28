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
import {
  useSendOtp,
  useVerifyOtp,
} from "@/shared/apiServices/client/clientOpenApiService";
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
  // const setUserSession = useUserSessionStore((s) => s.setSession); // Unused for now

  // Use new OpenAPI-based OTP hooks
  const { mutateAsync: sendOtp, isPending: isSending } = useSendOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();

  const [isOpen, setIsOpen] = useState(false);
  // const [requestData, setRequestData] = useState<string | undefined>(); // Unused
  const method = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      otp: "",
      email: "",
    },
  });

  const otpfor = method.watch("otp");

  const handleSubmit = async () => {
    const type = otpfor === 'email' ? 'email' : 'phone';

    try {
      await sendOtp({ body: { type }, headers: { Authorization: "" } });
      toast.success("OTP Requested, kindly check your phone for OTP");
      setIsOpen(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP Request failed";
      toast.error(errorMessage);
    }
  };

  const handleOtpSubmission = async (otp: string) => {
    const type = otpfor === 'email' ? 'email' : 'phone';

    try {
      await verifyOtp({
        body: {
          type,
          code: otp,
        },
        headers: { Authorization: "" }
      });

      setIsOpen(false);

      // TODO: New API returns { message: string }, not a session. 
      // We cannot set user session here yet without a token from this endpoint.
      // Assuming successful verification leads to dashboard for now.
      // setUserSession(response); 

      navigate(absoluteUrls.client.home.dashboard);
      toast.success("Logged in successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP Verification failed";
      toast.error(errorMessage);
    }
  };

  const onResendOtp = async () => {
    const type = otpfor === 'email' ? 'email' : 'phone';
    try {
      await sendOtp({ body: { type }, headers: { Authorization: "" } });
      toast.success("OTP Requested, kindly check your phone for OTP");
      setIsOpen(true);
    } catch (error) {
      toast.error("OTP Request failed");
    }
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={logo_light}
              className="h-15 w-24"
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
            loading={isSending}
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
            header={`Verify ${otpfor === "phoneNumber" ? "Phone Number" : "Email"
              }`}
            description={`A verification OTP has been sent to your ${otpfor === "phoneNumber" ? "phone" : "email"
              }. Please check your ${otpfor === "phoneNumber" ? "phone" : "email"
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

import logo_light from "@/assets/logo/logo_light.svg";
import { absoluteUrls } from "@/config/urls";
import {
  detectAndStoreCurrency,
  getCurrencyFromStorage,
} from "@/utils/currency";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useSendOtp,
  useVerifyOtp,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { AuthLoginWithOtp } from "@/shared/components/auth/AuthLoginWithOtp";

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

  const { mutateAsync: sendOtp, isPending: isSending } = useSendOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();

  const handleSendOtp = async (type: "email" | "phoneNumber", value: string) => {
    try {
      await sendOtp({ body: { type: type === "email" ? "email" : "phone" }, headers: { authorization: "" } });
      toast.success("OTP Requested, kindly check your phone for OTP");
    } catch (error) {
      console.log(`OTP Response: `, error);
      const errorMessage =
        error instanceof Error ? error.message : "OTP Request failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleVerifyOtp = async (type: "email" | "phoneNumber", value: string, otp: string) => {
    try {
      const response = await verifyOtp({
        body: {
          type: type === "email" ? "email" : "phone",
          code: otp,
        },
        headers: { authorization: "" },
      });

      console.log("Respone Engineer: ", response);

      if (type === "phoneNumber" && value) {
        detectAndStoreCurrency(value);
        getCurrencyFromStorage();
      }

      navigate(absoluteUrls.engineer.home.dashboard);
      toast.success("Logged in successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP Verification failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <AuthLoginWithOtp
      isSending={isSending}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onBackClick={() => setIsNumberLogin(false)}
      signUpUrl={absoluteUrls.engineer.auth.signup}
      logoDark={logo_light}
    />
  );
};

export default LoginWithNumber;

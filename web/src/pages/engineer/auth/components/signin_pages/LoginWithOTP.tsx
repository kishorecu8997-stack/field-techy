import logo_light from "@/assets/logo/logo_light.svg";
import { absoluteUrls } from "@/config/urls";
import {
  detectAndStoreCurrency,
  getCurrencyFromStorage,
} from "@/utils/currency";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAppSendLoginOtp,
  useAppVerifyLoginOtp,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { AuthLoginWithOtp } from "@/shared/components/auth/AuthLoginWithOtp";
import { UserRole } from "@/shared/enums/users";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { decodeJwtPayload, type JwtClientPayload } from "@/utils/jwtUtils";

/**
 * Renders a login form that allows users to sign in using their phone number or email via OTP.
 */
const LoginWithOTP = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const setUserSession = useUserSessionStore((s) => s.setSession);

  const { mutateAsync: sendOtp, isPending: isSending } = useAppSendLoginOtp();
  const { mutateAsync: verifyOtp } = useAppVerifyLoginOtp();

  const handleSendOtp = async (
    type: "email" | "phoneNumber",
    value: string,
  ) => {
    try {
      await sendOtp({
        body: {
          type: type === "email" ? "email" : "phone",
          email: value,
          userRole: "engineer",
        },
      });
      toast.success(`OTP Sent to your ${type === "email" ? "email" : "phone"}`);
    } catch (error) {
      console.log(`OTP Response: `, error);
      const errorMessage =
        error instanceof Error ? error.message : "OTP Request failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleVerifyOtp = async (
    type: "email" | "phoneNumber",
    value: string,
    otp: string,
  ) => {
    try {
      const response = await verifyOtp({
        body: {
          type: type === "email" ? "email" : "phone",
          email: value,
          code: otp,
          userRole: "engineer",
        },
      });

      console.log("Response Engineer Login: ", response);

      if (response?.token) {
        localStorage.setItem("auth_token", response.token);

        const payload = decodeJwtPayload<JwtClientPayload>(response.token);

        setUserSession({
          accessToken: response.token,
          userId: payload?.userId ? String(payload.userId) : "uuid-123",
          role: UserRole.ENGINEER,
          initiatedAt: Date.now(),
          regionId: payload?.regionId,
        });

        if (type === "phoneNumber" && value) {
          detectAndStoreCurrency(value);
          getCurrencyFromStorage();
        }

        navigate(absoluteUrls.engineer.home.dashboard);
        toast.success("Logged in successfully");
      }
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

export default LoginWithOTP;

import { absoluteUrls } from "@/config/urls";
import {
  useAppSendLoginOtp,
  useAppVerifyLoginOtp,
} from "@/shared/apiServices/client/clientOpenApiService";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { decodeJwtPayload, type JwtClientPayload } from "@/utils/jwtUtils";
import { UserRole } from "@/shared/enums/users";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthLoginWithOtp } from "@/shared/components/auth/AuthLoginWithOtp";

const LoginWithOtp = ({
  setIsOtpLogin,
}: {
  setIsOtpLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const setUserSession = useUserSessionStore((s) => s.setSession);

  const { mutateAsync: sendOtp, isPending: isSending } = useAppSendLoginOtp();
  const { mutateAsync: verifyOtp } = useAppVerifyLoginOtp();

  const handleSendOtp = async (type: "email" | "phoneNumber", value: string) => {
    try {
      await sendOtp({
        body: { type: type === "email" ? "email" : "phone", email: value, userRole: "client" }
      });
      toast.success("OTP Requested, kindly check your phone or email for OTP");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP Request failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleVerifyOtp = async (type: "email" | "phoneNumber", value: string, otp: string) => {
    try {
      const resp = await verifyOtp({
        body: {
          type: type === "email" ? "email" : "phone",
          email: value,
          userRole: "client",
          code: otp,
        }
      });

      if (resp?.token) {
        localStorage.setItem("auth_token", resp.token);

        const payload = decodeJwtPayload<JwtClientPayload>(resp.token);
        if (!payload?.userId) {
          toast.error("Login failed: unable to verify session. Please try again.");
          return;
        }

        setUserSession({
          accessToken: resp.token,
          userId: String(payload.userId),
          role: UserRole.CLIENT,
          initiatedAt: Date.now(),
          regionId: payload?.regionId,
        });

        navigate(absoluteUrls.client.home.dashboard);
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
      onBackClick={() => setIsOtpLogin(false)}
      signUpUrl={absoluteUrls.client.auth.signup}
    />
  );
};

export default LoginWithOtp;

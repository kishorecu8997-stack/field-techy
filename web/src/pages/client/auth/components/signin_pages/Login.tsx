import { absoluteUrls } from "@/config/urls";
import { useClientLogin } from "@/shared/apiServices/client/clientOpenApiService";
import { UserRole } from "@/shared/enums/users";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { decodeJwtPayload, type JwtClientPayload } from "@/utils/jwtUtils";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils";
import { AuthLogin } from "@/shared/components/auth/AuthLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginEmailFormData,
} from "../../validations/LoginEmail";

/**
 * Login component
 *
 * Renders the client sign-in form (email/password) with options to sign in
 * via phone number or LinkedIn.
 *
 * Props:
 * @param {{ setIsOtpLogin: React.Dispatch<React.SetStateAction<boolean>> }} props - A single prop used to switch to number-based login UI.
 * @returns {JSX.Element} Login form UI
 */
const Login = ({
  setIsOtpLogin,
}: {
  setIsOtpLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const setUserSession = useUserSessionStore((s) => s.setSession);

  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useClientLogin(
    {
      onSuccess: async (resp) => {
        // Store the token
        if (resp.token) {
          localStorage.setItem("auth_token", resp.token);
        }

        // Decode the JWT payload to extract claims (e.g. regionId, userId).
        // If decoding fails or userId is absent, abort login — proceeding without
        // a valid userId would create a broken session (profile won't load, etc.)
        const payload = decodeJwtPayload<JwtClientPayload>(resp.token);
        if (!payload?.userId) {
          toast.error(
            "Login failed: unable to verify session. Please try again.",
          );
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
      },
      onError: (error) => {
        console.error(error);
        // Skip showing toast for 401 errors as axios interceptor already handles it
        if (error instanceof AxiosError && error.response?.status === 401) {
          return;
        }
        const errorMessage = GlobalApiErrorHandler.handle(error).message;
        toast.error(errorMessage);
      },
    },
  );

  const handleSubmit = async (data: LoginEmailFormData) => {
    await loginMutation({
      body: {
        email: data.email,
        password: data.password,
        userRole: UserRole.CLIENT,
      },
    });
  };

  return (
    <AuthLogin<LoginEmailFormData>
      isLoggingIn={isLoggingIn}
      onEmailLoginSubmit={handleSubmit}
      onOtpLoginClick={() => setIsOtpLogin(true)}
      signUpUrl={absoluteUrls.client.auth.signup}
      forgetPasswordUrl={absoluteUrls.client.auth.forget_password}
      resolver={zodResolver(loginSchema)}
    />
  );
};

export default Login;

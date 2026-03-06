import { absoluteUrls } from "@/config/urls";
import Popup from "@/shared/components/Popup";
import { validatePassword } from "@/shared/libs/utils";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useEngineerLogin } from "@/shared/apiServices/engineer/engineerOpenApiService";
import TwoFASetup from "@/shared/components/TwoFASetup";
import { UserRole } from "@/shared/enums/users";
import { useTwoFactorAuth } from "@/shared/hooks/useTwoFactorAuth ";
import {
  useUserSessionStore,
  type UserSession,
} from "@/shared/store/useUserSessionStore";
import { getTwoFaStorage } from "@/utils/TwoFAStorage";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { LoginEmailFormData } from "../../validations/LoginEmail";
import { AuthLogin } from "@/shared/components/auth/AuthLogin";

/**
 * Login component
 *
 * Renders the engineer sign-in form (email/password) with options to sign in
 * via phone number or LinkedIn. Submitting opens the OTP dialog in this
 * implementation; after OTP success the access popup is shown.
 *
 * Props:
 * @param {{ setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>> }} props - A single prop used to switch to number-based login UI.
 * @returns {JSX.Element} Login form UI
 */
const Login = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const setUserSession = useUserSessionStore((s) => s.setSession);
  let currentEmail = ""; // Needed for useTwoFactorAuth

  const { mutateAsync: loginMutation, isPending: isLoggingIn } =
    useEngineerLogin({
      onSuccess: async (resp) => {
        if (resp.token) {
          localStorage.setItem("auth_token", resp.token);
        }

        setUserSession({
          accessToken: resp.token,
          userId: "uuid-123", // TODO: Get actual user ID from token or profile response
          role: UserRole.ENGINEER,
          initiatedAt: Date.now(),
        } as UserSession);

        const twoFa = getTwoFaStorage();
        if (twoFa.enabled) {
          triggerTwoFA();
          return;
        }

        navigate(absoluteUrls.engineer.home.dashboard);
        toast.success("Logged in successfully");
      },
      onError: (error) => {
        console.error(error);
        if (error instanceof AxiosError && error.response?.status === 401) {
          return;
        }
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        toast.error(errorMessage);
      },
    });

  const {
    isTwoFaOpen,
    setIsTwoFaOpen,
    otpauthUrl,
    handleSubmit: triggerTwoFA,
    verify,
  } = useTwoFactorAuth(currentEmail, setUserSession, () => {
    navigate(absoluteUrls.engineer.home.dashboard);
  });

  const handleSubmit = async (data: any) => {
    currentEmail = data.email;
    await loginMutation({
      body: {
        email: data.email,
        password: data.password,
        userRole: UserRole.ENGINEER,
      },
    });
  };

  return (
    <>
      <AuthLogin
        isLoggingIn={isLoggingIn}
        onEmailLoginSubmit={handleSubmit}
        onOtpLoginClick={() => setIsNumberLogin(true)}
        signUpUrl={absoluteUrls.engineer.auth.signup}
        forgetPasswordUrl={absoluteUrls.engineer.auth.forget_password}
        validatePasswordRule={true}
      />
      <Popup open={isTwoFaOpen} onClose={() => setIsTwoFaOpen(false)}>
        <TwoFASetup
          otpauthUrl={otpauthUrl}
          onVerify={verify}
          onClose={() => setIsTwoFaOpen(false)}
        />
      </Popup>
    </>
  );
};

export default Login;

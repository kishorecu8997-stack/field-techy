import { absoluteUrls } from "@/config/urls";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEngineerLogin } from "@/shared/apiServices/engineer/engineerOpenApiService";
import TwoFASetup from "@/shared/components/TwoFASetup";
import { UserRole } from "@/shared/enums/users";
import { useTwoFactorAuth } from "@/shared/hooks/useTwoFactorAuth ";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { getTwoFaStorage } from "@/utils/TwoFAStorage";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthLogin } from "@/shared/components/auth/AuthLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginEmailFormData,
} from "../../validations/LoginEmail";
import { decodeJwtPayload, type JwtClientPayload } from "@/utils/jwtUtils";

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
  const [currentEmail, setCurrentEmail] = useState(""); // Needed for useTwoFactorAuth

  const { mutateAsync: loginMutation, isPending: isLoggingIn } =
    useEngineerLogin({
      onSuccess: async (resp) => {
        if (resp.token) {
          localStorage.setItem("auth_token", resp.token);
        }

        const payload = decodeJwtPayload<JwtClientPayload>(resp.token);
        if (!payload) {
          toast.error(
            "Login failed: unable to verify session. Please try again.",
          );
          return;
        }

        setUserSession({
          accessToken: resp.token,
          userId: payload.userId ? String(payload.userId) : "uuid-123",
          role: UserRole.ENGINEER,
          initiatedAt: Date.now(),
          regionId: payload.regionId,
        });

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

  const handleSubmit = async (data: LoginEmailFormData) => {
    setCurrentEmail(data.email);
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
      <AuthLogin<LoginEmailFormData>
        isLoggingIn={isLoggingIn}
        onEmailLoginSubmit={handleSubmit}
        onOtpLoginClick={() => setIsNumberLogin(true)}
        signUpUrl={absoluteUrls.engineer.auth.signup}
        forgetPasswordUrl={absoluteUrls.engineer.auth.forget_password}
        validatePasswordRule={true}
        resolver={zodResolver(loginSchema)}
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

import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

/**
 * Custom hook for centralized auth-related navigation.
 * Provides convenient methods to navigate to all auth pages.
 */
export const useClientAuthNavigation = () => {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate(absoluteUrls.client.auth.login),
    goToSignup: () => navigate(absoluteUrls.client.auth.signup),
    goToProfileSetup: () => navigate(absoluteUrls.client.auth.profile_setup),
    goToForgetPassword: () =>
      navigate(absoluteUrls.client.auth.forget_password),
    goToResetPassword: () => navigate(absoluteUrls.client.auth.reset_password),
    goToSetPassword: () => navigate(absoluteUrls.client.auth.set_password),
    goToBackgroundVerification: () =>
      navigate(absoluteUrls.client.auth.background_verification),
  };
};

import { useNavigate } from 'react-router-dom';
import { absoluteUrls } from '@/config/urls';

/**
 * Custom hook for centralized auth-related navigation.
 * Provides convenient methods to navigate to all auth pages.
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate(absoluteUrls.engineer.auth.login),
    goToSignup: () => navigate(absoluteUrls.engineer.auth.signup),
    goToProfileSetup: () => navigate(absoluteUrls.engineer.auth.profile_setup),
    goToForgetPassword: () => navigate(absoluteUrls.engineer.auth.forget_password),
    goToResetPassword: () => navigate(absoluteUrls.engineer.auth.reset_password),
    goToSetPassword: () => navigate(absoluteUrls.engineer.auth.set_password),
    goToBackgroundVerification: () => navigate(absoluteUrls.engineer.auth.background_verification),
  };
};
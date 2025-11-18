import { useNavigate } from 'react-router-dom';
import { absoluteUrls } from '@/config/urls';

/**
 * Custom hook for centralized home-related navigation.
 * Provides convenient methods to navigate to all home pages. 
 */
export const useHomeNavigation = () => {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate(absoluteUrls.engineer.auth.login),
    goToHome: () => navigate(absoluteUrls.engineer.home.dashboard),
    goToMyJobs: () => navigate(absoluteUrls.engineer.home.my_jobs),
    goToSearchResult: () => navigate(absoluteUrls.engineer.home.search_result),
    goToJobDetails: (jobId: string) => navigate(`${absoluteUrls.engineer.home.my_jobs}/${jobId}`),
    goToFAQ: () => navigate(absoluteUrls.engineer.home.faq),
    goToTerms: () => navigate(absoluteUrls.engineer.home.terms_and_conditions),
    goToPrivacyPolicy: () => navigate(absoluteUrls.engineer.home.privacy_policy),
  };
};
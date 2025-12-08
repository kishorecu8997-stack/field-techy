import { absoluteUrls } from '@/config/urls';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for centralized home-related navigation.
 * Provides convenient methods to navigate to all home pages. 
 */
export const useClientHomeNavigation = () => {
  const navigate = useNavigate();

  return {
    goToDashboard: () => navigate(absoluteUrls.client.home.dashboard),
    goToMyJobs: () => navigate(absoluteUrls.client.home.my_jobs),
    goToSearchResult: () => navigate(absoluteUrls.client.home.search_result),
    goToJobDetails: (jobId: string) => navigate(`${absoluteUrls.client.home.my_jobs}/${jobId}`),
    goToFAQ: () => navigate(absoluteUrls.client.home.faq),
    goToTerms: () => navigate(absoluteUrls.client.home.terms_and_conditions),
    goToPrivacyPolicy: () => navigate(absoluteUrls.client.home.privacy_policy),
  };
};
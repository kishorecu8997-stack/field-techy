import { useNavigate } from 'react-router-dom';
import { absoluteUrls } from '@/config/urls';

/**
 * Custom hook for centralized home-related navigation.
 * Provides convenient methods to navigate to all home pages. 
 */
export const useHomeNavigation = () => {
  const navigate = useNavigate();

  return {
    goToMyJobs: () => navigate(absoluteUrls.engineer.home.my_jobs),
    goToSearchResult: () => navigate(absoluteUrls.engineer.home.search_result),
    goToJobDetails: (jobId: string) => navigate(`${absoluteUrls.engineer.home.my_jobs}/${jobId}`),
    goToFAQ: () => navigate(absoluteUrls.client.home.faq),
    goToTerms: () => navigate(absoluteUrls.client.home.terms_and_conditions),
    goToPrivacyPolicy: () => navigate(absoluteUrls.client.home.privacy_policy),
  };
};
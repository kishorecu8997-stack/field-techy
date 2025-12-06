import MyJobsHeader from "@/shared/components/MyJobsHeader";
import ContentPage from "./ContentPage";
import { useLocation } from "react-router-dom";
import { clientPrivacySections } from "@/dummy_data/clientPolicyDatas";

/**
 * Privacy Policy page that conditionally renders a header based on route context.
 * Displays static privacy policy content from dummy data.
 */
const PolicyPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        {!location.pathname.includes("/auth") && (
          <MyJobsHeader
            title="Privacy Policy"
            onSortChange={() => {}}
            isShowSort={false}
          />
        )}
        <ContentPage content={clientPrivacySections} />
      </div>
    </div>
  );
};

export default PolicyPage;

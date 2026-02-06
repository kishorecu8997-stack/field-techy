import { AboutAppSection } from "@/dummy_data/policyDatas";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import ContentPage from "./ContentPage";
import { useEffect } from "react";
import { scrollToTop } from "@/utils";

/**
 * About App page displaying information about the application using static dummy data.
 * Renders a header and content section via reusable components.
 */
const AboutApp = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="About App"
          onSortChange={() => {}}
          isShowSort={false}
        />
        <ContentPage content={AboutAppSection} />
      </div>
    </div>
  );
};

export default AboutApp;

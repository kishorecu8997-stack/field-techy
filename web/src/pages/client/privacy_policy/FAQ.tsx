import { clientFAQData } from "@/dummy_data/clientPolicyDatas";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import ContentPage from "./ContentPage";
import { scrollToTop } from "@/utils";
import { useEffect } from "react";

/**
 * FAQ page displaying frequently asked questions using static dummy data.
 * Renders a header and content section via reusable components.
 */
const FAQ = () => {
   useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader title="FAQ" onSortChange={() => {}} isShowSort={false} />
        <ContentPage content={clientFAQData} />
      </div>
    </div>
  );
};

export default FAQ;

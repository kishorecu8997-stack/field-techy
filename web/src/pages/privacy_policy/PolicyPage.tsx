import MyJobsHeader from "@/shared/components/MyJobsHeader";
import PrivacyPolicy from "./PrivacyPolicy";

const PolicyPage = () => {
  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Privacy Policy"
          currentSort="Newest"
          onSortChange={() => {}}
          isShowSort={false}
        />
        <div className=" mt-6">
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;

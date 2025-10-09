import { termsAndCondition } from "@/dummy_datas/policyDatas";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import ContentPage from "./ContentPage";

const TermsAndConditions = () => {
  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Terms & Conditions"
          onSortChange={() => {}}
          isShowSort={false}
        />
        <ContentPage content={termsAndCondition} />
      </div>
    </div>
  );
};

export default TermsAndConditions;

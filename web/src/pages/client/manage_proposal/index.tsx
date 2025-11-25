import Header from "@/shared/components/ClientHeader";
import Filters from "@/shared/components/Filters";
import ProposalListPage from "./components/ProposalListPage";
import MyJobsHeader from "@/shared/components/MyJobsHeader";

/**
 * `ManageProposal` is the main page component for clients to view and manage job proposals.
 * It renders a layout with a header, a list of proposals (`ProposalListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 * @returns {React.ReactElement} The rendered "Manage Proposal" page.
 */
const ManageProposal = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
              <MyJobsHeader title="Manage Proposal" currentSort="newest" isShowBreadcrumb={false} description={`${10}+ jobs found`} />
            </div>
            <div className="space-y-10">
              <ProposalListPage />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Filters />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProposal;

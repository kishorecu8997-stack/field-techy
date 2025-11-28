import { absoluteUrls } from "@/config/urls";
import { ProposalsList } from "@/dummy_data/client/ManageProposal";
import ManageProposalCard from "@/shared/components/cards/client/ManageProposalCard";
import Filters from "@/shared/components/Filters";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useNavigate } from "react-router-dom";

/**
 * `ManageProposal` is the main page component for clients to view and manage job proposals.
 * It renders a layout with a header, a list of proposals (`ProposalListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 * @returns {React.ReactElement} The rendered "Manage Proposal" page.
 */
const ManageProposal = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title="Manage Proposal"
            currentSort="newest"
            isShowBreadcrumb={false}
            description={`${10}+ jobs found`}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ProposalsList.map((proposal) => (
                <div className="cursor-pointer">
                  <ManageProposalCard
                    key={proposal.id} // add key if available
                    availability={proposal.availability}
                    bidAmount={proposal.bitAmount}
                    name={proposal.engineerName}
                    payType={proposal.payType}
                    rating={proposal.ratings}
                    reviews={proposal.reviewCount}
                    onClick={() =>
                      navigate(`${absoluteUrls.client.home.manage_proposal}/${proposal.id}`)
                    }
                  />
                </div>
              ))}
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

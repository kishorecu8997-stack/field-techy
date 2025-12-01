import { absoluteUrls } from "@/config/urls";
import { ProposalsList } from "@/dummy_data/client/ManageProposal";
import ManageProposalCard from "@/shared/components/cards/client/ManageProposalCard";
import Filters from "@/shared/components/Filters";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useNavigate } from "react-router-dom";
import Pagination from "../search_result/components/Pagination";
import { useState } from "react";

/**
 * `ManageProposal` is the main page component for clients to view and manage job proposals.
 * It renders a layout with a header, a list of proposals (`ProposalListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 * @returns {React.ReactElement} The rendered "Manage Proposal" page.
 */
const ManageProposal = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filtered engineers (mock — in real app, filter by category)
  const filteredProposalList = ProposalsList; // Add actual filtering logic if needed

  // Pagination
  const totalPages = Math.ceil(filteredProposalList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const List = filteredProposalList.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title="Manage Proposal"
            currentSort="newest"
            isShowBreadcrumb={false}
            description={`${List.length} jobs found`}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {List.map((proposal) => (
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
                      navigate(
                        `${absoluteUrls.client.home.manage_proposal}/${proposal.id}`
                      )
                    }
                  />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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

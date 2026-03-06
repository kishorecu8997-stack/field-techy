import { absoluteUrls } from "@/config/urls";
import { useClientGetAssignmentDetails } from "@/shared/apiServices/client/clientOpenApiService";
import ManageProposalCard from "@/shared/components/cards/client/ManageProposalCard";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import Filters from "@/shared/components/Filters";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../search_result/components/Pagination";

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

  const {
    data: assignments,
    isLoading,
    isError,
    error,
  } = useClientGetAssignmentDetails();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error loading data:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Filtered engineers (mock — in real app, filter by category)
  const filteredProposalList = assignments || []; // Add actual filtering logic if needed

  // Pagination
  const totalPages = Math.ceil(filteredProposalList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const List = filteredProposalList.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        <MyJobsHeader
          title="Manage Proposal"
          currentSort="newest"
          isShowSort={false}
          isShowBreadcrumb={false}
          description={`${filteredProposalList.length} jobs found`}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {List.map((proposal) => (
                <div className="cursor-pointer" key={proposal.assignmentId}>
                  <ManageProposalCard
                    availability={proposal.assignmentStatus || "N/A"}
                    bidAmount={String(proposal.engineer?.hourlyRate) || "N/A"}
                    name={proposal.engineer?.name || "N/A"}
                    payType="N/A"
                    rating="N/A"
                    reviews="0"
                    attachmentUrl={proposal.proposalAttachmentUrl || null}
                    receivedOn={
                      proposal.appliedAt || proposal.invitedAt
                        ? new Date(
                            proposal.appliedAt || proposal.invitedAt || "",
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : null
                    }
                    onClick={() =>
                      navigate(
                        `${absoluteUrls.client.home.manage_proposal}/${proposal.assignmentId}`,
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

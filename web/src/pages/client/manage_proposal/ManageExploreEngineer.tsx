import { absoluteUrls } from "@/config/urls";
import { earningsData } from "@/dummy_data/jobDetails";
import ExploreEngineerHeaderCard from "@/shared/components/cards/client/ExploreEngineerHeaderCard";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import {
  useClientGetAssignmentDetails,
  useClientActionOnAssignment,
} from "@/shared/apiServices/client/clientOpenApiService";
import { usePopupStore } from "@/shared/store/popupStore";
import { useNavigate, useParams } from "react-router-dom";

/**
 * `ManageProposal` is the main page component for clients to view and manage job proposals.
 * It renders a layout with a header, a list of proposals (`ProposalListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 * @returns {React.ReactElement} The rendered "Manage Proposal" page.
 */
const ManageExploreEngineer = () => {
  const params = useParams();

  const { data: assignments } = useClientGetAssignmentDetails({
    assignmentId: Number(params.id),
  });

  const getProposal = () => {
    // return ProposalsList.find((proposal) => proposal.id === Number(params.id));
    if (!assignments || assignments.length === 0) return undefined;
    const proposal = assignments[0];

    // Map API data to component expectations
    return {
      id: proposal.assignmentId,
      engineerName: proposal.engineer?.name || "Unknown Engineer",
      ratings: proposal.engineer?.averageRating || "N/A",
      reviewCount: "0", // Not available in API response yet
      bitAmount: proposal.engineer?.hourlyRate?.toString() || "N/A",
      payType: "Hourly", // Default or derived
      availability: proposal.assignmentStatus || "Unknown",
      jobName: (proposal as any).jobTitle || "Job", // Accessing extra prop we know exists
      proposal: proposal.proposalDetail || "No details",
      portfolioDoc: "Portfolio", // Placeholder
    };
  };
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  const { mutateAsync: actionOnAssignment } = useClientActionOnAssignment();

  const handleAccept = async () => {
    await showPopup({
      title: "Assign Job",
      body: "Are you sure you want to assign this job?",
      actionButtons: [
        {
          label: "No",
          variant: "secondary",
          value: "decline",
          action: (close) => {
            close(true);
          },
        },
        {
          label: "Yes, accept",
          variant: "primary",
          value: "accept",
          action: async (close) => {
            try {
              await actionOnAssignment({
                body: {
                  assignmentId: Number(params.id),
                  // this data should be come from the client data or job list
                  pendingApproval: "application",
                  action: "approve",
                },
              });
              navigate(
                `${absoluteUrls.client.home.job_details}/${getProposal()?.id}`,
              );
              close(true);
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
    });
  };

  const handleDecline = () => {
    showPopup({
      title: "Decline Proposal",
      body: "Are you sure you want to decline this proposal?",
      actionButtons: [
        {
          label: "No",
          variant: "secondary",
          value: "cancel",
          action: (close) => {
            close(true);
          },
        },
        {
          label: "Yes, decline",
          variant: "primary",
          value: "decline",
          action: async (close) => {
            try {
              await actionOnAssignment({
                body: {
                  assignmentId: Number(params.id),
                  // this data should be come from the client data or job list
                  pendingApproval: "application",
                  action: "reject",
                },
              });
              navigate(-1);
              close(true);
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title="Explore Engineers"
            isShowBreadcrumb={false}
            isShowSort={false}
            description={`${10}+ jobs found`}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExploreEngineerHeaderCard
              name={getProposal()?.engineerName as string}
              rating={getProposal()?.ratings as string}
              reviews={getProposal()?.reviewCount as string}
              bidAmount={getProposal()?.bitAmount as string}
              payType={getProposal()?.payType as string}
              availability={getProposal()?.availability as string}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
            <div className=" flex flex-col gap-6 pt-4 px-4">
              <span className="flex text-gray-700 dark:text-gray-200 gap-2">
                <p className="text-gray-700 dark:text-gray-200  font-semibold">
                  Job:
                </p>
                <span className="font-semibold text-green-800 hover:underline cursor-pointer">
                  {getProposal()?.jobName}
                </span>
              </span>
              <span className="flex flex-col text-gray-700   dark:text-gray-200 gap-2">
                <p className="text-gray-700 dark:text-gray-200 text-xl font-semibold">
                  proposal:
                </p>
                <span className=" ">{getProposal()?.proposal}</span>
              </span>
              <span>
                <p className="text-gray-700 dark:text-gray-200 text-xl font-semibold">
                  Past Work & Portfolio
                </p>
                <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-200 pt-2">
                  <span className="text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-700 rounded-md p-2 w-fit">
                    {getProposal()?.portfolioDoc}
                  </span>
                </div>
              </span>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageExploreEngineer;

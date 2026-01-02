import { ProposalsList } from "@/dummy_data/client/manage-proposal";
import { earningsData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import { sampleJobs as sampleJobs1 } from "@/dummy_data/searchData";
import JobHeaderCard from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/JobHeaderCard";
import JobTabSection from "@/pages/engineer/my_job/job_details_components/JobTabSection";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { type JobStatus } from "../search_result/types";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const ClientJobDetails = () => {
  const params = useParams();
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [OfferJobStatus, setOfferJobStatus] = useState<
    "initial" | "accepted" | "declined" | "started" | "checked-in" | undefined
  >("initial");

  const jobId = Number(params.jobId);
  const id = Number(params.id);

  const proposal = ProposalsList.find((job) => job.id === id);
  const data = sampleJobs.find((job) => job.id === jobId);
  const matchedJob = proposal
    ? sampleJobs1.find((job) => job.id === proposal.jobID)
    : data
      ? sampleJobs.find((job) => job.id === jobId)
      : null;

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader title="Job Details" isShowBreadcrumb />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={matchedJob?.title as string}
              client={matchedJob?.client as string}
              duration={matchedJob?.duration as string}
              type={matchedJob?.type}
              status={matchedJob?.status}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
            />
            <JobTabSection
              //@ts-expect-error Unable to resolve to a known type, refer the right type of job status and fix the mismatch
              status={matchedJob?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              OfferJobStatus={OfferJobStatus}
            />
          </div>
          <SidebarJobPostWallet earnings={earningsData} />
        </div>
      </div>
    </div>
  );
};

export default ClientJobDetails;

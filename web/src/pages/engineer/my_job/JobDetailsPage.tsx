import { useClientGetJobsById } from "@/shared/apiServices/client/clientService";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import JobTabSection from "./job_details_components/JobTabSection";
import { getDurationString } from "@/utils";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const params = useParams();
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [OfferJobStatus, setOfferJobStatus] = useState<
    "initial" | "accepted" | "declined" | "started" | "checked-in" | undefined
  >("initial");

  const { data: jobs } = useClientGetJobsById(params.jobId ?? "");
  const client = jobs?.client;

  if (!params.jobId) {
    return null;
  }

  const getDuration = getDurationString({
    startDateStr: jobs?.startDate as string,
    endDateStr: jobs?.projectDeadline as string,
  });

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Job Details"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => {}}
          isReport
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobs?.jobTitle as string}
              client={client?.companyName as string}
              duration={getDuration as string}
              type={jobs?.engagementModel as string}
              status={jobs?.status as JobStatus}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
            />
            <JobTabSection
              status={jobs?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              OfferJobStatus={OfferJobStatus}
            />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={client?.companyName as string}
              memberSince={"-" as string}
              location={"-" as string}
              rating={"-"}
              reviews={0}
              verifications={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

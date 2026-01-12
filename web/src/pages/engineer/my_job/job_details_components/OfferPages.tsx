import { client as dummyClient, jobHeaderData as dummyJobHeader } from "@/dummy_data/jobDetails";
import { useClientGetJobsById } from "@/shared/apiServices/client/clientService";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../../search_result/types";
import ClientInfoCard from "./ClientInfoCard";
import JobHeaderCard from "./jobHeaderComponents/JobHeaderCard";
import JobTabSection from "./JobTabSection";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const OfferPages = () => {
  const { jobId } = useParams();
  const { data: apiJob } = useClientGetJobsById(jobId || "");

  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [isJobAccepted, setIsJobAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");

  const jobData = useMemo(() => {
    if (!apiJob) return null;
    return {
      title: apiJob.jobTitle || "Untitled Job",
      client: apiJob.client?.companyName || "Hidden Client",
      duration: apiJob.jobDuration || "Not specified",
      type: apiJob.engagementModel || "ON_SITE",
      status: apiJob.status || "NEW",
    };
  }, [apiJob]);

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Job Details"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => { }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobData?.title || dummyJobHeader.title}
              client={jobData?.client || dummyJobHeader.client}
              duration={jobData?.duration || dummyJobHeader.duration}
              type={jobData?.type}
              status={jobData?.status}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setIsJobAccepted={setIsJobAccepted}
              setActiveTab={setActiveTab}
            />
            <JobTabSection
              status={jobData?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              isJobAccepted={isJobAccepted}
              activeTab={activeTab}
            />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={apiJob?.client?.companyName || dummyClient.name}
              memberSince={dummyClient.memberSince}
              location={apiJob?.location || dummyClient.location}
              rating={dummyClient.rating}
              reviews={dummyClient.reviews}
              verifications={dummyClient.verifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPages;

import { client, jobHeaderData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchData";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import JobHeaderCard from "./job_details_components/JobHeaderCard";
import JobTabSection from "./job_details_components/JobTabSection";
import MyJobsHeader from "@/shared/components/MyJobsHeader";

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
  const [OfferJobStatus, setOfferJobStatus] = useState<"accepted" | "declined" | "started" | "checked-in" | undefined>();

  const filter = () => {
    return sampleJobs.find((job) => {
      return job.id === Number(params.jobId);
    });
  };

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Job Details"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => {}}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobHeaderData.title}
              client={jobHeaderData.client}
              duration={jobHeaderData.duration}
              type={filter()?.type}
              status={filter()?.status}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
            />
            <JobTabSection
              status={filter()?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              OfferJobStatus={OfferJobStatus}
            />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={client.name}
              memberSince={client.memberSince}
              location={client.location}
              rating={client.rating}
              reviews={client.reviews}
              verifications={client.verifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

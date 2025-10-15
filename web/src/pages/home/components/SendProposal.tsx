import { client, jobHeaderData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchData";
import ClientInfoCard from "@/pages/my_job/job_details_components/ClientInfoCard";
import JobHeaderCard from "@/pages/my_job/job_details_components/JobHeaderCard";
import JobTabSection from "@/pages/my_job/job_details_components/JobTabSection";
import { SORT_OPTIONS, type JobStatus } from "@/pages/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
// import { useParams } from "react-router-dom";

/**
 * Displays the engineer's dashboard with job listings and profile sidebar.
 * Includes a header with sorting controls and uses dummy data for user and earnings.
 */
const SendProposal = () => {
//   const { jobId } = useParams();
  const [isSendProposal, setIsSendProposal] = useState(false);

  const filter = () => {
    return sampleJobs?.filter((job) => {
      return job?.id === "4";
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
              type={filter()[0]?.type}
              status={filter()[0]?.status}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
            />
            <JobTabSection
              status={filter()[0].status as JobStatus}
              isSendProposal={isSendProposal}
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

export default SendProposal;

import { client } from "@/dummy_data/jobDetails";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import JobTabSection from "./job_details_components/JobTabSection";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useEngineerGetJobById } from "@/shared/apiServices/engineer/engineerService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useClientGetJobsById } from "@/shared/apiServices/client/clientService";
/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const {jobId} = useParams();
  const user = useUserSessionStore();
  const engineerId = user.session?.userId;
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [OfferJobStatus, setOfferJobStatus] = useState<"initial" | "accepted" | "declined" | "started" | "checked-in" | undefined>("initial");
  const {
    data:job,
    isLoading,
    isError,
  } = useEngineerGetJobById(jobId!, {
    enabled: !!jobId && !!engineerId,
  });
  const jobData = job?.[0];
  const { data: jobs,
   } = useClientGetJobsById( jobId?? "", );
  if (isLoading) {
  return (
    <div className="flex justify-center items-center h-[50vh] w-full col-span-2">
      <LoaderComponent />
    </div>
  );
}
   if (isError || !job) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500 col-span-2">
        Failed to load job details
      </div>
    );
  }
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
              client={jobs?.client.contactPersonName as string}
              duration={jobs?.timePeriodOfJob as string}
              type={jobs?.engagementModel}
              status={jobData?.status}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
            />
            <JobTabSection
              status={jobData?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              OfferJobStatus={OfferJobStatus}
            />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={jobs?.client.contactPersonName as string}
              memberSince={client.memberSince}
              location={jobs?.location as string}
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

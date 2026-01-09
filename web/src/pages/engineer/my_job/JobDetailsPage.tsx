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
import ReviewClientModal from "./job_details_components/jobHeaderComponents/ReviewClientModal";
import { toast } from "react-toastify";
/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const { jobId } = useParams();
  const user = useUserSessionStore();
  const engineerId = user.session?.userId;
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [OfferJobStatus, setOfferJobStatus] = useState<"initial" | "accepted" | "declined" | "started" | "checked-in" | undefined>("initial");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const handleSubmitReview = () => {
    toast.success("Review submitted successfully");
    setIsReviewOpen(false);
  };
  const {
    data: job,
    isLoading,
    isError,
  } = useEngineerGetJobById(jobId!, {
    enabled: !!jobId && !!engineerId,
  });
  const jobData = job;
  const { data: clientJob } = useClientGetJobsById( jobId ?? "", );
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] w-full col-span-2">
        <LoaderComponent />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500 col-span-2">
        Unable to load job details. Please check your connection and try again.
      </div>
    );
  }
  if (!job) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500 col-span-2">
        The job was not found. The job may have been removed, or you may not have access.
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
              title={clientJob?.jobTitle as string}
              client={clientJob?.client.contactPersonName as string}
              duration={clientJob?.timePeriodOfJob as string}
              type={clientJob?.engagementModel}
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
              name={clientJob?.client?.contactPersonName as string}
              memberSince={client.memberSince}
              location={clientJob?.location as string}
              rating={client.rating}
              reviews={client.reviews}
              verifications={client.verifications}
              onOpenReview={() => setIsReviewOpen(true)}
            />
          </div>
        </div>
      </div>

      <ReviewClientModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        clientName={(clientJob?.client?.contactPersonName as string) ?? "Client"}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default JobDetailsPage;

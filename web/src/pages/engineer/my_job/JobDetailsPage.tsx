
import { client } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchData";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import JobTabSection from "./job_details_components/JobTabSection";
import ReviewClientModal from "./job_details_components/jobHeaderComponents/ReviewClientModal";

const JobDetailsPage = () => {
  const params = useParams();
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [OfferJobStatus, setOfferJobStatus] = useState<"initial" | "accepted" | "declined" | "started" | "checked-in" | undefined>("initial");

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [pendingReview, setPendingReview] = useState<
    { rating: number; review: string} | null
  >(null);

  const filter = () => {
    return sampleJobs.find((job) => job.id === Number(params.jobId));
  };

  const selectedJob = filter();

  const handleSubmitReview = (payload: { rating: number; review: string }) => {
    setPendingReview(payload);
    console.log("Review submitted:", {
      client: selectedJob?.client,
      ...payload,
    });
    
  };

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
              title={selectedJob?.title as string}
              client={selectedJob?.client as string}
              duration={selectedJob?.duration as string}
              type={selectedJob?.type}
              status={selectedJob?.status}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
            />
            <JobTabSection
              status={selectedJob?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              OfferJobStatus={OfferJobStatus}
            />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={selectedJob?.client as string}
              memberSince={client.memberSince}
              location={selectedJob?.location as string}
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
        clientName={(selectedJob?.client as string) ?? "Client"}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default JobDetailsPage;

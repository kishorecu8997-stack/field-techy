import {
  client as dummyClient,
  jobHeaderData as dummyJobHeader,
} from "@/dummy_data/jobDetails";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  SORT_OPTIONS,
  type JobStatus,
  type AssignmentStatus,
} from "../../search_result/types";
import ClientInfoCard from "./ClientInfoCard";
import JobHeaderCard from "./jobHeaderComponents/JobHeaderCard";
import JobTabSection from "./JobTabSection";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const OfferPages = () => {
  const { jobId } = useParams();

  // Fetch job details directly using the API
  const { data: apiJob } = useEngineerSearchJobs(
    { jobId: Number(jobId) },
    !!jobId,
  );

  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("Timeline");
  const [offerJobStatus, setOfferJobStatus] = useState<
    AssignmentStatus | undefined
  >();

  const rawJob = useMemo(() => {
    if (!apiJob) return null;
    return Array.isArray(apiJob) ? (apiJob[0] as any) : (apiJob as any);
  }, [apiJob]);

  const jobData = useMemo(() => {
    if (!rawJob) return null;

    // Safely access client details
    const clientName =
      rawJob.clientDetails?.companyName ||
      rawJob.clientDetails?.personName ||
      "Unknown Client";

    return {
      title: rawJob.jobTitle || "Untitled Job",
      client: clientName,
      duration:
        rawJob.startDate && rawJob.endDate
          ? `${rawJob.startDate} - ${rawJob.endDate}`
          : "Not specified",
      type: "ON_SITE", // TODO: Map engagementModelId
      status: rawJob.status || "NEW",
      assignmentStatus: rawJob.assignmentStatus || undefined,
    };
  }, [rawJob]);

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
              title={jobData?.title || dummyJobHeader.title}
              client={jobData?.client || dummyJobHeader.client}
              duration={jobData?.duration || dummyJobHeader.duration}
              type={jobData?.type}
              status={jobData?.status}
              OfferJobStatus={offerJobStatus || jobData?.assignmentStatus}
              setOfferJobStatus={setOfferJobStatus as any}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              jobId={""}
            />
            <JobTabSection
              status={jobData?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              jobId={Number(jobId)}
              workLocationLat={rawJob?.workLocationLat ?? null}
              workLocationLng={rawJob?.workLocationLng ?? null}
              workLocationName={rawJob?.workLocationName ?? null}
            />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={
                rawJob?.clientDetails?.companyName ||
                rawJob?.clientDetails?.personName ||
                "Client"
              }
              memberSince={dummyClient.memberSince}
              location={rawJob?.workLocationName || dummyClient.location}
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

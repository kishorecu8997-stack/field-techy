import ContactDetailsCard from "@/shared/components/manage_job_components/ContactDetailsCard";
import JobStatusCard from "@/shared/components/manage_job_components/JobStatusCard";
import ManageJobDetails from "./ManageJobDetails";
import { useSearchParams } from "react-router-dom";
import { JOB_STATUSES, type JobStatus } from "@/constants/jobStatus";
import { useAdminGetJobDetails } from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * JobDetails Component
 *
 * Displays a job details page with job information, job status, and contact details.
 * Uses ManageJobDetails component for job details and job status card.
 *
 * @component
 * @example
 * <JobDetails />
 */
const JobDetails = () => {
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const jobId = jobIdParam ? Number(jobIdParam) : NaN;
  const shouldFetch = Number.isFinite(jobId);

  const { data, isLoading, error } = useAdminGetJobDetails(
    shouldFetch ? { jobId } : undefined,
    { enabled: shouldFetch },
  );

  const mapJobStatus = (status?: string): JobStatus => {
    if (!status) return JOB_STATUSES.PENDING;
    const normalized = status.toLowerCase();
    if (normalized === "posted") return JOB_STATUSES.PENDING;
    if (normalized === "in progress" || normalized === "in-progress") {
      return JOB_STATUSES.IN_PROGRESS;
    }
    if (normalized === "completed") return JOB_STATUSES.COMPLETED;
    if (normalized === "closed") return JOB_STATUSES.CLOSED;
    if (normalized === "hold") return JOB_STATUSES.HOLD;
    if (normalized === "cancelled" || normalized === "canceled") {
      return JOB_STATUSES.CANCELED;
    }
    return status as JobStatus;
  };

  const job = data?.job;
  const client = data?.client;
  const engineers = (data?.engineers ?? []).filter(
    (engineer) => engineer.assignmentStatus === "started"
  );

  const infoData = [
    { label: "Job Title", value: job?.jobTitle ?? "-" },
    { label: "Job Description", value: job?.jobDescription ?? "-" },
    { label: "Job Type", value: job?.jobType ?? "-" },
    { label: "Service Category", value: job?.categoryName ?? "-" },
    { label: "Job Price", value: (job as any)?.currencySymbol ? `${(job as any).currencySymbol}${job?.totalPrice}` : job?.totalPrice ?? "-" },
    { label: "Country", value: job?.countryName ?? "-" },
    { label: "State", value: job?.stateName ?? "-" },
    { label: "City", value: job?.cityName ?? "-" },
    { label: "No of Engineers", value: engineers.length || "-" },
  ];


  if (!shouldFetch) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600">
        Missing job id.
      </div>
    );
  }

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-600">
        Failed to load job details.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div className="flex justify-between w-full flex-wrap gap-4">
          <JobStatusCard
            jobId={job?.jobCode || String(job?.id ?? "N/A")}
            date={new Date(job?.createdAt || Date.now())}
            status={mapJobStatus(job?.status ?? undefined)}
          />
          <ContactDetailsCard
            client={{
              name: client?.personName || client?.companyName || "-",
              email: client?.email || "-",
              phone: client?.phoneNumber || "-",
            }}
            engineers={engineers.map((engineer) => ({
              name: engineer.name || "-",
              email: engineer.email || "-",
              phone: engineer.phoneNumber || "-",
            }))}
          />
          <ManageJobDetails job={infoData} />
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

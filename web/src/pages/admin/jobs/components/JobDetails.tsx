import { formatAmount } from "@/utils/currency";
import ContactDetailsCard from "@/shared/components/manage_job_components/ContactDetailsCard";
import JobStatusCard from "@/shared/components/manage_job_components/JobStatusCard";
import ManageJobDetails from "./ManageJobDetails";
import { useSearchParams } from "react-router-dom";
import { JOB_STATUSES, type JobStatus } from "@/constants/jobStatus";
import { useAdminGetJobDetails } from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { usePopupStore } from "@/shared/store/popupStore";

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

  const { showPopup } = usePopupStore();

  const mapJobStatus = (status?: string): JobStatus => {
    switch (status) {
      case "Posted":
        return JOB_STATUSES.PENDING;
      case "In Progress":
        return JOB_STATUSES.IN_PROGRESS;
      case "Cancelled":
        return JOB_STATUSES.CANCELED;
      case "Closed":
        return JOB_STATUSES.CLOSED;
      case "Hold":
        return JOB_STATUSES.HOLD;
      case "Flagged":
        return JOB_STATUSES.FLAGGED;
      default:
        return JOB_STATUSES.PENDING;
    }
  };

  const job = data?.job;
  const client = data?.client;
  const engineers = (data?.engineers ?? []).filter(
    (engineer) =>
      engineer.assignmentStatus === "started" ||
      engineer.assignmentStatus === "assigned" ||
      engineer.assignmentStatus === "paid" ||
      engineer.assignmentStatus === "submitted",
  );

  const showJobDescriptionModal = (description?: string) => {
    if (!description) return;
    showPopup({
      title: "Job Description",
      body: (
        <div
          className="max-h-[70vh] w-full overflow-y-auto p-4 whitespace-pre-wrap break-words"
          style={{ wordBreak: "break-word" }}
        >
          {" "}
          {description}
        </div>
      ),
      actionButtons: [
        {
          label: "Close",
          value: "close",
          variant: "primary",
          action: (close: (result: unknown) => void) => close(null),
        },
      ],
    });
  };

  const infoData = [
    { label: "Job Title", value: job?.jobTitle ?? "-" },
    {
      label: "Job Description",
      value: (
        <div className="flex items-center gap-2">
          <span
            className="truncate max-w-[200px]"
            title={job?.jobDescription ?? ""}
          >
            {job?.jobDescription ?? "-"}
          </span>
          {job?.jobDescription && (
            <button
              type="button"
              className="text-blue-600 underline text-sm cursor-pointer hover:underline"
              onClick={() =>
                showJobDescriptionModal(job.jobDescription || undefined)
              }
            >
              See More
            </button>
          )}
        </div>
      ),
    },
    { label: "Job Type", value: job?.jobType ?? "-" },
    { label: "Service Category", value: job?.categoryName ?? "-" },
    {
      label: "Job Price",
      value: formatAmount(
        job?.totalPrice,
        (job as { currencySymbol?: string })?.currencySymbol,
      ),
    },
    { label: "Country", value: job?.countryName ?? "-" },
    { label: "State", value: job?.stateName ?? "-" },
    { label: "City", value: job?.cityName ?? "-" },
    {
      label: "No of Vacancies",
      value: (job as { vacancies?: number })?.vacancies ?? "-",
    },
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

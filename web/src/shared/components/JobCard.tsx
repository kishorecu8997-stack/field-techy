import { absoluteUrls } from "@/config/urls";
import {
  WORKING_TYPES,
  WORKING_TYPES_PROPERTY,
} from "@/pages/engineer/search_result/types";
import { JobStatusBadge } from "@/shared/components/JobStatusBadge/JobStatusBadge";
import { getDurationString, scrollToTop } from "@/utils";
import { getCurrencyFromStorage } from "@/utils/currency";
import { useMemo } from "react";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  useClientGetById,
  useClientGetJobsById,
} from "../apiServices/client/clientService";
import LoaderComponent from "./commonUI/LoaderComponent";

interface JobCardProps {
  [key: string]: any;
  allocationType?: "Automatic" | "Manual";
}

/**
 * Reusable job card component displaying key job details with status and type badges.
 * Links to the job details page on click.
 *
 * @param {Job} props - Job data including title, client, location, pay, status, etc.
 */
const JobCard: React.FC<JobCardProps> = (props) => {
  const { allocationType = "Automatic" } = props;
  const job = props;
  const normalized = useMemo(() => {
    return {
      jobId: job.jobId,
      status: job.status || "NEW",
    };
  }, [props]);

  const { jobId, status } = normalized;
  const { data: jobs, isLoading:isJobsLoading, isError: isJobsError } = useClientGetJobsById(jobId ?? "");
  const { data: client } = useClientGetById(jobs?.clientId || "");
  const getDuration =
    jobs?.startDate && jobs?.projectDeadline
      ? getDurationString({
          startDateStr: jobs.startDate,
          endDateStr: jobs.projectDeadline,
        })
      : undefined;
  if (isJobsLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] w-full col-span-2">
        <LoaderComponent />
      </div>
    );
  }
  if (isJobsError || !jobs) {
    return (
      <div className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-700 text-sm text-red-700 dark:text-red-300">
        Failed to load job information.
      </div>
    );
  }
  return (
    <Link
      to={`${absoluteUrls.engineer.home.my_jobs}/${jobId}`}
      onClick={() => scrollToTop()}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {jobs?.jobTitle}
        </h3>
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-medium bg-teal-800 text-white dark:bg-teal-700 whitespace-nowrap`}
        >
          {(() => {
            switch (jobs?.engagementModel) {
              case WORKING_TYPES.onsite:
                return WORKING_TYPES_PROPERTY.onsite;
              case WORKING_TYPES.remote:
                return WORKING_TYPES_PROPERTY.remote;
              case WORKING_TYPES.hybrid:
                return WORKING_TYPES_PROPERTY.hybrid;
              default:
                return "Unknown"; // Fallback for unexpected types
            }
          })()}
        </span>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <p>
          <span className="font-medium">Client:</span>{" "}
          {client?.companyName || "N/A"}
        </p>
        <p>
          <span className="font-medium">Start: </span>
          {[jobs?.startDate, jobs?.startTime].filter(Boolean).join(" , ")}
        </p>
        <p>
          <span className="font-medium">Duration:</span> {getDuration}
        </p>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <MdLocationPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {[jobs?.city, jobs?.country].filter(Boolean).join(", ") || "N/A"}
          </span>
        </div>

        <div className="flex items-center  text-sm font-semibold text-teal-800 dark:text-teal-400">
          <span>
            {getCurrencyFromStorage()}
            {jobs?.salary}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <JobStatusBadge status={status} />
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-2">
          <span className="font-medium">Allocation:</span> {allocationType}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;

import { absoluteUrls } from "@/config/urls";
import {
  WORKING_TYPES,
  WORKING_TYPES_PROPERTY,
  type Job,
} from "@/pages/engineer/search_result/types";
import { scrollToTop } from "@/utils";
import { getCurrencyFromStorage } from "@/utils/currency";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import { JobStatusBadge } from "@/shared/components/JobStatusBadge/JobStatusBadge";
interface JobCardProps extends Job {
  allocationType?: "Automatic" | "Manual";
}

/**
 * Reusable job card component displaying key job details with status and type badges.
 * Links to the job details page on click.
 *
 * @param {Job} props - Job data including title, client, location, pay, status, etc.
 */
const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  client,
  startDate,
  duration,
  location,
  pay,
  status,
  type,
  allocationType = "Automatic",
}) => {
  return (
    <Link
      to={`${absoluteUrls.engineer.home.my_jobs}/${id}`}
      onClick={() => scrollToTop()}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-medium bg-teal-800 text-white dark:bg-teal-700 whitespace-nowrap`}
        >
          {type === WORKING_TYPES.onsite
            ? WORKING_TYPES_PROPERTY.onsite
            : WORKING_TYPES_PROPERTY.remote}
        </span>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <p>
          <span className="font-medium">Client:</span> {client}
        </p>
        <p>
          <span className="font-medium">Start:</span> {startDate}
        </p>
        <p>
          <span className="font-medium">Duration:</span> {duration}
        </p>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <MdLocationPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center  text-sm font-semibold text-teal-800 dark:text-teal-400">
          <span>
            {getCurrencyFromStorage()}
            {pay}
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

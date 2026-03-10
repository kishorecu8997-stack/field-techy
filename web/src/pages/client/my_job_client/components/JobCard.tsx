import { absoluteUrls } from "@/config/urls";
import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import { useServiceCategories } from "@/shared/hooks/useLookup";
import { formatAmount } from "@/utils/currency";
import { useMemo } from "react";
import { IoMdTime } from "react-icons/io";
import {
  IoCalendarOutline,
  IoConstructOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  WORKING_TYPES,
  WORKING_TYPES_PROPERTY,
  type Job,
} from "../../search_result/types";
import LocationDisplay from "@/shared/components/commonUI/LocationDisplay";

interface JobCardProps {
  job: Job;
}

/**
 * A component representing the job card.
 *
 * This component renders a job card that displays the job details.
 * It utilizes the reusable `Link` component for handling the navigation.
 *
 * This component is designed to be rendered within a `Route` from `react-router-dom`
 * to connect the job card to the main route.
 *
 * @param {JobCardProps} props - The props for the JobCard component.
 * @param {Job} props.job - The job data.
 *
 * @returns {JSX.Element} The job card.
 *
 * @example
 * <JobCard job={job} />
 */
const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const {
    id,
    title = "Untitled",
    type = "remote",
    startDate = "N/A",
    duration = "N/A",
    location = "N/A",
    pay = "N/A",
    status = "unknown",
    serviceType,
    serviceCategoryId,
    currencySymbol = "$",
  } = job;

  const { data: serviceCategories = [] } = useServiceCategories();

  const resolvedServiceType = useMemo(() => {
    if (serviceCategoryId != null) {
      const match = serviceCategories.find(
        (c) => String(c.id) === String(serviceCategoryId),
      );
      if (match) return match.name;
    }
    return serviceType ?? "N/A";
  }, [serviceCategoryId, serviceCategories, serviceType]);

  // Check if pay is already formatted (contains currency symbol) or is N/A
  const isPayFormatted = pay !== "N/A" && !/^\d+(\.\d+)?$/.test(pay);
  const displayPay = isPayFormatted ? pay : formatAmount(pay);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "inprogress":
        return "text-yellow-600 dark:text-yellow-400";
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "posted":
        return "text-blue-600 dark:text-blue-400";
      case "hold":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getWorkModeColor = () => {
    return "bg-indigo-600 text-white"; // both use same style per your code
  };
  const isOnsite = type === WORKING_TYPES.onsite;
  const isDummyNetworkEngineer = isDummyNetworkEngineerJob(id);

  return (
    <Link
      to={`${absoluteUrls.client.home.my_jobs}/${id}?regionId=${job.regionId}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mr-2">
          {title}
        </h3>
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium flex-shrink-0 ${getWorkModeColor()}`}
        >
          {isOnsite
            ? WORKING_TYPES_PROPERTY.onsite
            : WORKING_TYPES_PROPERTY.remote}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center min-w-0">
            <IoMdTime className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{startDate}</span>
          </div>
          <span className={`text-xs font-medium flex-shrink-0 ${getStatusColor(status)}`}>
            {status.toLowerCase() === "inprogress"
              ? "In-Progress"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="flex items-start text-sm text-gray-600 dark:text-gray-300 min-w-0">
          <IoLocationOutline className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="break-words">
            <LocationDisplay
              countryId={job.countryId}
              stateId={job.stateId}
              cityId={job.cityId}
              workLocationName={job.workLocationName}
              fallback={location}
            />
          </div>
        </div>

        {!isDummyNetworkEngineer && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <IoCalendarOutline className="w-4 h-4 mr-2 flex-shrink-0" />
            {duration}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoConstructOutline className="w-4 h-4 mr-2 flex-shrink-0" />
          {resolvedServiceType}
        </div>

        {displayPay !== "N/A" && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center font-semibold">
              {currencySymbol}
            </span>
            <span className="font-medium">{displayPay}</span>
          </div>
        )}
        {displayPay === "N/A" && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center font-semibold">
              {currencySymbol}
            </span>
            <span className="font-medium">Price not set</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default JobCard;

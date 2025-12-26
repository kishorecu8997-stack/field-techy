import { IoMdTime } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoConstructOutline,
} from "react-icons/io5";
import { WORKING_TYPES, WORKING_TYPES_PROPERTY, type Job } from "../../search_result/types";
import { Link } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

interface JobCardProps {
  job: Job;
}

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
    serviceType = "N/A",
  } = job;

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

  const getWorkModeColor = (_: string) => {
    return "bg-indigo-600 text-white"; // both use same style per your code
  };

  const isOnsite = type === WORKING_TYPES.onsite;

  return (
    <Link
      to={`${absoluteUrls.client.home.my_jobs}/${id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h3>
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getWorkModeColor(type)}`}
        >
          {isOnsite ? WORKING_TYPES_PROPERTY.onsite : WORKING_TYPES_PROPERTY.remote}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <IoMdTime className="w-4 h-4 mr-2 flex-shrink-0" />
            {startDate}
          </div>
          <span className={`text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoLocationOutline className="w-4 h-4 mr-2 flex-shrink-0" />
          {location}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoCalendarOutline className="w-4 h-4 mr-2 flex-shrink-0" />
          {duration}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoConstructOutline className="w-4 h-4 mr-2 flex-shrink-0" />
          Service Type: {serviceType}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <RiMoneyDollarCircleLine className="w-4 h-4 mr-2 flex-shrink-0" />
          {pay}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
import { urls } from "@/config/urls";
import { WORKING_TYPES, type Job } from "@/pages/serch_result/types";
import { Link } from "react-router-dom";
import { MdLocationPin } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa6";

const JobCard: React.FC<Job> = ({
  id,
  title,
  client,
  startDate,
  duration,
  location,
  pay,
  status,
  type,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "inprogress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeColor = () => {
    return type === WORKING_TYPES.onsite
      ? "bg-teal-800 text-white dark:bg-teal-700"
      : "bg-purple-600 text-white dark:bg-purple-700";
  };

  return (
    <Link
      to={`${urls.home.my_jobs}/${id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}
        >
          {type}
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
          <FaDollarSign className="h-3 w-3 flex-shrink-0" />
          <span>{pay}</span>
        </div>
      </div>

      <div className="mt-3">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {status}
        </span>
      </div>
    </Link>
  );
};

export default JobCard;

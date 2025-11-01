import { useForm } from "react-hook-form";
import type { Job } from "../types";
import { IoMdTime } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoConstructOutline,
} from "react-icons/io5";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Determine status color based on job status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-yellow-600 dark:text-yellow-400";
      case "Completed":
        return "text-green-600 dark:text-green-400";
      case "Posted":
        return "text-blue-600 dark:text-blue-400";
      case "Hold":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Determine work mode color
  const getWorkModeColor = (workMode: string) => {
    return workMode === "On Site"
      ? "bg-blue-600 text-white"
      : "bg-indigo-600 text-white";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {job.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getWorkModeColor(
            job.workMode
          )}`}
        >
          {job.workMode}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <IoMdTime className="w-4 h-4 mr-2" />
            {job.date}
          </div>
          <span className={`text-xs font-medium ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoLocationOutline className="w-4 h-4 mr-2" />
          {job.location}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoCalendarOutline className="w-4 h-4 mr-2" />
          {job.duration}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoConstructOutline className="w-4 h-4 mr-2" />
          Service Type: {job.serviceType}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <RiMoneyDollarCircleLine className="w-4 h-4 mr-2" />
          {job.price}
        </div>
      </div>
    </div>
  );
};

export default JobCard;

import { IoMdTime } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoConstructOutline,
} from "react-icons/io5";
import type { JobInvite } from "../../types";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaRegCircle } from "react-icons/fa";

interface JobCardProps {
  job: JobInvite;
  isSelected: boolean;
  onToggle: (id: number) => void;
  locationString?: string;
}

/**
 * `JobInviteCard` component displays a summary of a single job.
 * It shows details like title, date, location, duration, service type, price, and status.
 * The appearance of the status and work mode indicators is styled based on their values.
 */
const JobInviteCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  onToggle,
  locationString,
}) => {
  const location = locationString || job.location || "";
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

  return (
    <div
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
      onClick={() => onToggle(job.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {job.title}
        </h3>

        <div
          className={`relative w-5 h-5 cursor-pointer transition-colors duration-200 ${
            isSelected
              ? "border-teal-900"
              : "border-gray-400 dark:bg-gray-700 dark:border-gray-600"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(job.id);
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              onToggle(job.id);
            }
          }}
          aria-label={isSelected ? "Selected" : "Not selected"}
        >
          {isSelected ? (
            <AiOutlineCheckCircle className="w-full h-full text-teal-800 dark:text-teal-400" />
          ) : (
            <FaRegCircle className="w-full h-full text-gray-400 dark:text-gray-500" />
          )}
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(job.id)}
          className="sr-only"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <IoMdTime className="w-4 h-4 mr-2" />
            {job.date}
          </div>
          <span
            className={`text-xs font-medium ${getStatusColor(job.status ?? "")}`}
          >
            {job.status?.toLowerCase() === "inprogress"
              ? "In-Progress"
              : job.status
                ? job.status.charAt(0).toUpperCase() + job.status.slice(1)
                : ""}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoLocationOutline className="w-4 h-4 mr-2" />
          {location}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoCalendarOutline className="w-4 h-4 mr-2" />
          {job.duration}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoConstructOutline className="w-4 h-4 mr-2" />
          {job.serviceType}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <RiMoneyDollarCircleLine className="w-4 h-4 mr-2" />
          {job.price}
        </div>

        {job.status && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 capitalize font-semibold border border-gray-400 dark:border-gray-600 rounded-lg px-2 py-1 w-fit">
            {job.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInviteCard;

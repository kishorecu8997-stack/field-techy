import { IoMdTime } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoConstructOutline,
} from "react-icons/io5";
import type { JobInvite } from "../../types";

interface JobCardProps {
  job: JobInvite;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

/**
 * `JobCard` component displays a summary of a single job.
 * It shows details like title, date, location, duration, service type, price, and status.
 * The appearance of the status and work mode indicators is styled based on their values.
 * @param {JobCardProps} props The properties for the component.
 * @param {Job} props.job An object containing the details of the job to display.
 */
const JobInviteCard: React.FC<JobCardProps> = ({ job, isSelected, onToggle }) => {
  return (
    <div
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer `}
      onClick={() => onToggle(job.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {job.title}
        </h3>       
        <div
          className={`relative w-5 h-5 rounded-full cursor-pointer border-2 transition-colors duration-200 ${
            isSelected
              ? "bg-teal-800 border-teal-900"
              : "bg-white border-gray-400 dark:bg-gray-700 dark:border-gray-600"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(job.id);
          }}
          role="checkbox"
          aria-checked={isSelected}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              onToggle(job.id);
            }
          }}
        >
          {isSelected && (
            <svg
              className="absolute inset-0 w-full h-full text-white pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        {/* Hidden native checkbox for form submission */}
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

export default JobInviteCard;

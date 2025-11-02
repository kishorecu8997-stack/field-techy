import React from "react";
import type { Job } from "../types";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { BiDollar } from "react-icons/bi";
/**
 * JobCard component displays a single job listing
 *
 * @param {Object} props - Component props
 * @param {Job} props.job - Job data to display
 * @param {boolean} [props.showBookmark=true] - Whether to show bookmark icon
 * @returns {JSX.Element} Rendered job card component
 */
const JobCard: React.FC<{ job: Job; showBookmark?: boolean }> = ({
  job,
  showBookmark = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
            <span>
              Client:{" "}
              <strong className="text-gray-800 dark:text-white">
                {job.client}
              </strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              Time:{" "}
              <strong className="text-gray-800 dark:text-white">
                {job.time}
              </strong>
            </span>
          </div>
        </div>
        {showBookmark && (
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            <RiCalendarScheduleLine className="h-4 w-4 flex-shrink-0" />
            <span>{job.postedTime}</span>
          </div>
        )}
      </div>

      <p className="dark:text-gray-300 text-gray-700 mb-4">{job.description}</p>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5">
            <IoLocationSharp className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-gray-800 dark:text-gray-200">
              {job.location}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            <BiDollar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-gray-800 dark:text-gray-200">
              {job.salary}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

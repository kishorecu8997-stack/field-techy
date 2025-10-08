import React from "react";
import type { Job } from "../types";

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
    <div className="bg-gray-50 rounded-lg p-6 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>
              Client: <strong>{job.client}</strong>
            </span>
            <span>|</span>
            <span>
              Time: <strong>{job.time}</strong>
            </span>
          </div>
        </div>
        {showBookmark && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm9 4a1 1 0 11-2 0 1 1 0 012 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{job.postedTime}</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4">{job.description}</p>
      <div className="flex items-center justify-between bg-white rounded-md p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L7 11H5v-2L2.05 6.05zm6.9 2.95a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-800">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10v6M4 12a2 2 0 002 2h6M12 14a2 2 0 002-2V6a2 2 0 00-2-2h-2.343A6 6 0 003.657 6H2v4a2 2 0 002 2v6a2 2 0 002 2h2a2 2 0 002-2m0-10V4a2 2 0 00-2-2H8a2 2 0 00-2 2v6M8 12a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-800">{job.salary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

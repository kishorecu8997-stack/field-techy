import { icons } from "@/config/icons";
import React, { useState, useEffect } from "react";
import { BiDollar, BiSolidCalendar } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { Job } from "../types";
import { scrollToTop } from "@/utils";
import {
  toggleSavedJob,
  isJobSaved,
  BOOKMARK_CHANGE_EVENT,
} from "@/utils/bookmarkUtils";
import { toast } from "react-toastify";

/**
 * JobCard component displays a single job listing
 *
 * @param {Object} props - Component props
 * @param {Job} props.job - Job data to display
 * @param {boolean} [props.showBookmark=true] - Whether to show bookmark icon
 * @returns {JSX.Element} Rendered job card component
 */
const JobCard: React.FC<{
  job: Job;
  showBookmark?: boolean;
  navigateToJob?: string;
  onBookmarkChange?: () => void;
}> = ({ job, showBookmark = true, navigateToJob = "#", onBookmarkChange }) => {
  const [isBookmarked, setBookmark] = useState(false);
  useEffect(() => {
    setBookmark(isJobSaved(job.id));
  }, [job.id]);
  useEffect(() => {
    const handleBookmarkChange = () => {
      setBookmark(isJobSaved(job.id));
    };
    window.addEventListener(BOOKMARK_CHANGE_EVENT, handleBookmarkChange);
    return () => {
      window.removeEventListener(BOOKMARK_CHANGE_EVENT, handleBookmarkChange);
    };
  }, [job.id]);

  return (
    <Link
      id="recommendedJobs"
      to={navigateToJob}
      onClick={() => {
        scrollToTop();
      }}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm sm:p-6 mb-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
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
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const wasBookmarked = isBookmarked;
                toggleSavedJob(job);
                if (!wasBookmarked) {
                  toast.success("Job saved successfully");
                } else {
                  toast.error("Job removed from saved");
                }
                if (onBookmarkChange) {
                  onBookmarkChange();
                }
              }}
              className={`p-2 rounded-full  hover:bg-gray-100 transition-colors cursor-pointer`}
            >
              {isBookmarked ? (
                <icons.bookmarkFilled className="h-4 w-4 flex-shrink-0 text-green-700" />
              ) : (
                <icons.bookmark className="h-4 w-4 flex-shrink-0 " />
              )}
            </div>
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
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            <BiSolidCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-gray-800 dark:text-gray-200">
              {job.startDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;

import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Job } from "../../search_result/types";
import {
  toggleSavedJob,
  isJobSaved,
  BOOKMARK_CHANGE_EVENT,
} from "@/utils/bookmarkUtils";
import { toast } from "react-toastify";

/**
 * JobCard Component - Displays a single job listing card
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Job title
 * @param {string} props.company - Company name
 * @param {string} props.companyLogo - Company logo URL or path
 * @param {string} props.category - Job category (e.g., "IT")
 * @param {string} props.employmentType - Employment type (e.g., "Full-Time")
 * @param {string} props.locationType - Location type (e.g., "On Site")
 * @param {string} props.salary - Salary information
 * @param {string} props.location - Job location
 * @param {boolean} [props.isBookmarked=false] - Whether the job is bookmarked
 * @param {Function} [props.onBookmarkToggle] - Callback function when bookmark is toggled
 *
 * @example
 * <JobCard
 *   title="Software Engineer"
 *   company="Google"
 *   companyLogo="/logos/google.png"
 *   category="IT"
 *   employmentType="Full-Time"
 *   locationType="On Site"
 *   salary="$180,000/year"
 *   location="California, USA"
 * />
 */
const FeatureJobCard: React.FC<Job> = (job) => {
  const {
    id,
    title,
    company,
    category,
    employmentType,
    type,
    salary,
    location,
    isBookmarked = false,
  } = job;

  const [isSelected, setSelected] = useState(isBookmarked);

  useEffect(() => {
    if (id) {
      setSelected(isJobSaved(id));
    }
  }, [id]);

  useEffect(() => {
    const handleBookmarkChange = () => {
      if (id) {
        setSelected(isJobSaved(id));
      }
    };

    window.addEventListener(BOOKMARK_CHANGE_EVENT, handleBookmarkChange);

    return () => {
      window.removeEventListener(BOOKMARK_CHANGE_EVENT, handleBookmarkChange);
    };
  }, [id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!id) return;

    const wasBookmarked = isSelected;

    toggleSavedJob(job);

    setSelected(!wasBookmarked);

    if (!wasBookmarked) {
      toast.success("Job saved successfully");
    } else {
      toast.error("Job removed from saved");
    }

    window.dispatchEvent(new Event(BOOKMARK_CHANGE_EVENT));
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {company}
            </p>
          </div>
        </div>
        <div
          onClick={handleBookmarkClick}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-500 dark:text-gray-400"
          aria-label={isSelected ? "Remove bookmark" : "Bookmark job"}
        >
          {isSelected ? (
            <icons.bookmarkFilled className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <icons.bookmark className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Tags section - theme-aware background */}
      <div className="flex flex-wrap gap-2 mb-3 w-full py-2">
        <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
          {category}
        </span>
        {employmentType && (
          <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
            {employmentType}
          </span>
        )}
        {type && (
          <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
            {type}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-gray-900 dark:text-white">
          {salary}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {location}
        </span>
      </div>
    </div>
  );
};

/**
 * FeaturedJobs Component - Displays a list of featured job cards
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.jobs - Array of job objects to display
 * @param {string} [props.title="Featured Jobs"] - Title for the section
 * @param {Function} [props.onViewAll] - Callback function when "View all" is clicked
 *
 * @example
 * <FeaturedJobs
 *   jobs={[
 *     {
 *       title: "Software Engineer",
 *       company: "Google",
 *       companyLogo: "/logos/google.png",
 *       category: "IT",
 *       employmentType: "Full-Time",
 *       locationType: "On Site",
 *       salary: "$180,000/year",
 *       location: "California, USA"
 *     }
 *   ]}
 * />
 */
interface FeaturedJobsProps {
  jobs: Job[];
  title?: string;
  onViewAll?: () => void;
}

const jobCardGradients = [
  "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700",
  "bg-gradient-to-br from-green-50 to-green-100 dark:from-emerald-900/30 dark:to-emerald-800/30",
  "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
  "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
  "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30",
  "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30",
  "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30",
  "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
];

const FeaturedJobs: React.FC<FeaturedJobsProps> = ({
  jobs,
  title = "Featured Jobs",
  onViewAll,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {onViewAll && (
          <div
            onClick={onViewAll}
            className="text-teal-600 hover:text-teal-800 font-medium text-sm hover:underline dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer"
          >
            View all
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <div
            key={job.id || index}
            className={`rounded-xl p-4 shadow-sm cursor-pointer ${
              jobCardGradients[index % jobCardGradients.length]
            }`}
            onClick={() => {
              navigate(`${absoluteUrls.engineer.home.my_jobs}/${job.id}`);
            }}
          >
            <FeatureJobCard {...job} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { FeaturedJobs, FeatureJobCard };

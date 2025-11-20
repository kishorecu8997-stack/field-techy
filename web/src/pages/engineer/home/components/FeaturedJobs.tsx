import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  title: string;
  company: string;
  companyLogo: string;
  category: string;
  employmentType: string;
  locationType: string;
  salary: string;
  location: string;
  isBookmarked?: boolean;
}

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
const FeatureJobCard: React.FC<JobCardProps> = ({
  title,
  company,
  companyLogo,
  category,
  employmentType,
  locationType,
  salary,
  location,
  isBookmarked = false,
}) => {
  const [isSelected, setSelected] = useState(isBookmarked);
  console.log('company :', company);
  return (
    <div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center">
            {/* <img
              src={companyLogo}
              alt={`logo`}
              className="flex w-10 h-10 object-contain justify-center items-center "
            /> */}
           {company === "Google" ? <FcGoogle size={30} /> : <FaFacebook size={30} color="#3b5998" />}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {company}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelected(!isSelected)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-500 dark:text-gray-400"
          aria-label={isSelected ? "Remove bookmark" : "Bookmark job"}
        >
          {isSelected ? (
            <icons.bookmarkFilled className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <icons.bookmark className="h-4 w-4" />
          )}
        </button>
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
        {locationType && (
          <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
            {locationType}
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
  jobs: Array<{
    title: string;
    company: string;
    companyLogo: string;
    category: string;
    employmentType: string;
    locationType: string;
    salary: string;
    location: string;
    isBookmarked?: boolean;
    id: number | string;
  }>;
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
          <button
            onClick={onViewAll}
            className="text-teal-600 hover:text-teal-800 font-medium text-sm cursor-pointer hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            View all
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 shadow-sm cursor-pointer ${
              jobCardGradients[index % jobCardGradients.length]
            }`}
            onClick={()=>navigate(`${absoluteUrls.engineer.home.my_jobs}/${job.id}`)}
          >
            <FeatureJobCard {...job} />
          </div>
        ))}
      </div>
    </div>
  );
};
export { FeatureJobCard, FeaturedJobs };

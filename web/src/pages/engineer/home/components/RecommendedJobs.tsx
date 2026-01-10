import { absoluteUrls } from "@/config/urls";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import React from "react";
import type { JobItem } from "../types";

interface RecommendedJobsProps {
  jobs: JobItem[];
  userSkills?: string[];
  userTools?: string[];
  title?: string;
  onViewAll?: () => void;
}

/**
 * Displays a list of recommended jobs.
 *
 * @param {RecommendedJobsProps} props - Props for the RecommendedJobs component.
 * @returns {JSX.Element} The rendered RecommendedJobs component.
 */
const RecommendedJobs: React.FC<RecommendedJobsProps> = ({
  jobs = [],
  userSkills = [],
  userTools = [],
  title = "Recommended Jobs",
  onViewAll,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center  p-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {onViewAll && (
          <div
            onClick={onViewAll}
            className="text-teal-600 hover:text-teal-800 font-medium text-sm cursor-pointer hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            View all
          </div>
        )}
      </div>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          userSkills={userSkills}
          userTools={userTools}
          navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
        />
      ))}
    </div>
  );
};

const RecommendedJobsMemo = React.memo(RecommendedJobs);

export { RecommendedJobsMemo as RecommendedJobs };

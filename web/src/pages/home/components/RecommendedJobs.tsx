import { absoluteUrls } from "@/config/urls";
import JobCard from "@/pages/search_result/components/JobCard";
import type { Job } from "@/pages/search_result/types";
import React from "react";

interface RecommendedJobsProps {
  jobs: Job[];
  title?: string;
  onViewAll?: () => void;
}

const RecommendedJobs: React.FC<RecommendedJobsProps> = ({
  jobs,
  title = "Recommended Jobs",
  onViewAll,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center  p-2">
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
      {jobs.map((job: Job) => (
        <JobCard key={job.id} job={job} navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`} />
      ))}
    </div>
  );
};

export { RecommendedJobs };

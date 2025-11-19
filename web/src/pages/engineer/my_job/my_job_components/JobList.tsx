import { sampleJobs } from "@/dummy_data/searchData";
import JobCard from "@/shared/components/JobCard";
import { useMemo } from "react";
import { JOB_STATUSES } from "../../search_result/types";

/**
 * Renders a responsive grid of job cards using dummy job data.
 *
 * Displays a list of available jobs in a responsive grid layout (1 column on mobile,
 * 2 columns on medium screens and up). If no jobs are available, shows a "No jobs found"
 * message. Each job is rendered using the `JobCard` component.
 *
 * @returns {JSX.Element} A grid layout containing job cards or a fallback message.
 */
const JobList = () => {
  const filteredJobs = useMemo(() => {
    return sampleJobs.filter(
      (job) =>
        job.status !== JOB_STATUSES.new && job.status !== JOB_STATUSES.offer
    );
  }, []);
  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} {...job} />)
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            No jobs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;

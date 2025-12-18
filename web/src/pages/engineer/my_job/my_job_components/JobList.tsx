import { sampleJobs } from "@/dummy_data/searchData";
import JobCard from "@/shared/components/JobCard";
import { useMemo } from "react";
import { JOB_STATUSES } from "../../search_result/types";

interface JobListProps {
  activeFilter: string;
}

/**
 * Renders a responsive grid of job cards using dummy job data.
 *
 * Displays a list of available jobs in a responsive grid layout (1 column on mobile,
 * 2 columns on medium screens and up). If no jobs are available, shows a "No jobs found"
 * message. Each job is rendered using the `JobCard` component.
 * 
 * @param activeFilter - The active status filter to apply.
 * @returns {JSX.Element} A grid layout containing job cards or a fallback message.
 */
const JobList = ({ activeFilter = "All Jobs" }: { activeFilter?: string }) => {
  const filteredJobs = useMemo(() => {
    let jobs = sampleJobs.filter(
      (job) =>
        job.status !== JOB_STATUSES.new && job.status !== JOB_STATUSES.offer
    );
    if (activeFilter !== "All Jobs") {
      const normalizedActive = activeFilter.toLowerCase().replace(/\s+/g, '');
      const targetStatus = Object.values(JOB_STATUSES).find(status => status.toLowerCase().replace(/\s+/g, '') === normalizedActive);
      if (targetStatus !== undefined) {
        jobs = jobs.filter((job) => (job.status as string).toLowerCase().replace(/\s+/g, '') === targetStatus.toLowerCase().replace(/\s+/g, ''));
      }
    }
    return jobs;
  }, [activeFilter]);

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

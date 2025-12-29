import { sampleJobs } from "@/dummy_data/searchData";
import JobCard from "@/shared/components/JobCard";
import { useMemo } from "react";
import { JOB_STATUSES, WORKING_TYPES } from "../../search_result/types";

interface JobListProps {
  activeFilter: string;
}

/**
 * Renders a responsive grid of job cards using dummy job data.
 * Displays a list of available jobs in a responsive grid layout (1 column on mobile,
 * 2 columns on medium screens and up). If no jobs are available, shows a "No jobs found"
 * message. Each job is rendered using the `JobCard` component.
 * @param {JobListProps} props The properties for the component.
 * @param {string} props.activeFilter The currently selected filter string.
 * @returns {JSX.Element} A grid layout containing job cards or a fallback message.
 */
const JobList = ({ activeFilter }: JobListProps) => {
  const filteredJobs = useMemo(() => {
    let jobs = sampleJobs.filter(
      (job) =>
        job.status !== JOB_STATUSES.new && job.status !== JOB_STATUSES.offer
    );

    if (activeFilter === "All Jobs") {
      return jobs;
    } else if (activeFilter === "Applied") {
      return jobs.filter((job) => job.status === JOB_STATUSES.applied);
    } else if (activeFilter === "In Progress") {
      return jobs.filter((job) => job.status === JOB_STATUSES.inprogress);
    } else if (activeFilter === "Completed") {
      return jobs.filter((job) => job.status === JOB_STATUSES.completed);
    } else if (activeFilter === "Remote") {
      return jobs.filter((job) => job.type === WORKING_TYPES.remote);
    } else if (activeFilter === "On-Site") {
      return jobs.filter((job) => job.type === WORKING_TYPES.onsite);
    } else if (activeFilter === "Hybrid") {
      return jobs.filter((job) => job.type === WORKING_TYPES.hybrid);
    } else {
      // For other filters like "Today", "Declined", "Cancelled", return all jobs for now as they might not be implemented
      return jobs;
    }
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

import { useGetJobs } from "@/shared/apiServices/client/clientService";
import JobCard from "@/shared/components/JobCard";
import { useMemo } from "react";
import type { JobFilter } from "../../search_result/types";
import {
  JOB_FILTERS
} from "../../search_result/types";


interface JobListProps {
  activeFilter: JobFilter;
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
  const { data: apiJobs } = useGetJobs();

  const filteredJobs = useMemo(() => {
    const jobs = (apiJobs || []).filter(
      (job: any) =>
        job.status !== "NEW" && job.status !== "OFFER"
    );

    if (activeFilter === JOB_FILTERS.ALL_JOBS) {
      return jobs;
    } else if (activeFilter === JOB_FILTERS.APPLIED) {
      return jobs.filter((job: any) => job.status === "APPLIED");
    } else if (activeFilter === JOB_FILTERS.IN_PROGRESS) {
      return jobs.filter((job: any) => job.status === "IN_PROGRESS");
    } else if (activeFilter === JOB_FILTERS.COMPLETED) {
      return jobs.filter((job: any) => job.status === "COMPLETED");
    } else if (activeFilter === JOB_FILTERS.REMOTE) {
      return jobs.filter((job: any) => job.engagementModel === "REMOTE");
    } else if (activeFilter === JOB_FILTERS.ON_SITE) {
      return jobs.filter((job: any) => job.engagementModel === "ON_SITE");
    } else if (activeFilter === JOB_FILTERS.HYBRID) {
      return jobs.filter((job: any) => job.engagementModel === "HYBRID");
    } else {
      // For other filters like "Today", "Declined", "Cancelled", return all jobs for now as they might not be implemented
      return jobs;
    }
  }, [activeFilter]);
  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job: any) => <JobCard key={job.id} {...job} />)
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

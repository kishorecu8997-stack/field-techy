import JobCard from "@/shared/components/JobCard";
import { useMemo } from "react";
import type { JobFilter } from "../../search_result/types";
import { JOB_FILTERS } from "../../search_result/types";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

interface JobListProps {
  activeFilter: JobFilter;
  jobs: any[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Renders a responsive grid of job cards using passed job data.
 * Displays a list of available jobs in a responsive grid layout (1 column on mobile,
 * 2 columns on medium screens and up). If no jobs are available, shows a "No jobs found"
 * message. Each job is rendered using the `JobCard` component.
 * @param {JobListProps} props The properties for the component.
 * @param {string} props.activeFilter The currently selected filter string.
 * @param {Array} props.jobs The list of jobs.
 * @param {boolean} props.isLoading Loading state.
 * @param {boolean} props.isError Error state.
 * @returns {JSX.Element} A grid layout containing job cards or a fallback message.
 */
const JobList = ({
  activeFilter,
  jobs: jobsAll,
  isLoading,
  isError,
}: JobListProps) => {
  const filteredJobs = useMemo(() => {
    const jobs = (jobsAll || []).filter(
      (job) => job.status !== "NEW" && job.status !== "OFFER",
    );

    if (activeFilter === JOB_FILTERS.ALL_JOBS) {
      return jobs;
    } else if (activeFilter === JOB_FILTERS.APPLIED) {
      return jobs.filter((job) => job.status === "Posted");
    } else if (activeFilter === JOB_FILTERS.IN_PROGRESS) {
      return jobs.filter((job) => job.status === "In Progress");
    } else if (activeFilter === JOB_FILTERS.COMPLETED) {
      return jobs.filter((job) => job.status === "Closed");
    } else if (activeFilter === JOB_FILTERS.REMOTE) {
      return jobs.filter((job) => job.engagementModel === "REMOTE");
    } else if (activeFilter === JOB_FILTERS.ON_SITE) {
      return jobs.filter((job) => job.engagementModel === "ON_SITE");
    } else if (activeFilter === JOB_FILTERS.HYBRID) {
      return jobs.filter((job) => job.engagementModel === "HYBRID");
    } else {
      return jobs;
    }
  }, [activeFilter, jobsAll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] w-full col-span-2">
        <LoaderComponent />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="col-span-2 text-center py-10 text-red-500">
        Unable to load jobs. Please check your internet connection and try
        again.
      </div>
    );
  }
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

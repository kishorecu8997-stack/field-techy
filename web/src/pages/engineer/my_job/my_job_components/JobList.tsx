import JobCard from "@/shared/components/JobCard";
import { useMemo } from "react";
import {
  JOB_STATUSES,
  WORKING_TYPES,
  JOB_FILTERS,
} from "../../search_result/types";
import type { JobFilter } from "../../search_result/types";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useEngineerGetJobs } from "@/shared/apiServices/engineer/engineerService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

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
  const user = useUserSessionStore();
  const engineerId = user.session?.userId;

  const {
    data: jobsAll = [],
    isLoading,
    isError,
  } = useEngineerGetJobs(engineerId ?? "", {
    enabled: !!engineerId,
  });
  const filteredJobs = useMemo(() => {
    const jobs = jobsAll.filter(
      (job) =>
        job.status !== JOB_STATUSES.new && job.status !== JOB_STATUSES.offer
    );

    if (activeFilter === JOB_FILTERS.ALL_JOBS) {
      return jobs;
    } else if (activeFilter === JOB_FILTERS.APPLIED) {
      return jobs.filter((job) => job.status === JOB_STATUSES.applied);
    } else if (activeFilter === JOB_FILTERS.IN_PROGRESS) {
      return jobs.filter((job) => job.status === JOB_STATUSES.inprogress);
    } else if (activeFilter === JOB_FILTERS.COMPLETED) {
      return jobs.filter((job) => job.status === JOB_STATUSES.completed);
    } else if (activeFilter === JOB_FILTERS.REMOTE) {
      return jobs.filter((job) => job.type === WORKING_TYPES.remote);
    } else if (activeFilter === JOB_FILTERS.ON_SITE) {
      return jobs.filter((job) => job.type === WORKING_TYPES.onsite);
    } else if (activeFilter === JOB_FILTERS.HYBRID) {
      return jobs.filter((job) => job.type === WORKING_TYPES.hybrid);
    } else {
      // For other filters like "Today", "Declined", "Cancelled", return all jobs for now as they might not be implemented
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

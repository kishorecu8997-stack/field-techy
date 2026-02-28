import JobCard from "@/shared/components/JobCard";
import type { EngineerGetMyJobsResponse } from "@/api";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import ErrorState from "@/shared/components/commonUI/ErrorState";

interface JobListProps {
  jobs: EngineerGetMyJobsResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Renders a responsive grid of job cards using passed job data.
 * Displays a list of available jobs in a responsive grid layout (1 column on mobile,
 * 2 columns on medium screens and up). If no jobs are available, shows a "No jobs found"
 * message. Each job is rendered using the `JobCard` component.
 * @param {JobListProps} props The properties for the component.
 * @param {Array} props.jobs The list of jobs.
 * @param {boolean} props.isLoading Loading state.
 * @param {boolean} props.isError Error state.
 * @returns {JSX.Element} A grid layout containing job cards or a fallback message.
 */
const JobList = ({ jobs, isLoading, isError, refetch }: JobListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] w-full col-span-2">
        <LoaderComponent />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="col-span-2">
        <ErrorState
          title="Unable to Load Jobs"
          message="Something went wrong. Please try again later."
          onRetry={refetch}
        />
      </div>
    );
  }
  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              status={job.status ?? undefined}
              currencySymbol={job.currencySymbol ?? "$"}
            />
          ))
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

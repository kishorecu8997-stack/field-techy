import { sampleJobs } from "@/dummy_data/searchData";
import JobCard from "@/shared/components/JobCard";

/**
 * Renders a responsive grid of job cards using dummy job data.
 *
 * Displays a list of available jobs in a responsive grid layout (1 column on mobile,
 * 2 columns on medium screens and up). If no jobs are available, shows a "No jobs found"
 * message. Each job is rendered using the `JobCard` component.
 *
 * @returns {JSX.Element} A grid layout containing job cards or a fallback message.
 *
 * @example
 * <JobList />
 */
const JobList = () => {

 const filterJobs = () => {
    return sampleJobs.filter((job) => {
      return job.status !== "new";
    });
  };

  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filterJobs().length > 0 ? (
          filterJobs().map((job) => <JobCard key={job.id} {...job} />)
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

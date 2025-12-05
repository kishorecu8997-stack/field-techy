import { sampleJobs } from "@/dummy_data/searchDataClient";
import JobCard from "./JobCard";

/*
 * JobList component is used to display the list of jobs
 * It contains the job cards for each job
 */
const JobList = () => {
  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleJobs.length > 0 ? (
          sampleJobs.map((job) => <JobCard key={job.id} job={job} />)
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
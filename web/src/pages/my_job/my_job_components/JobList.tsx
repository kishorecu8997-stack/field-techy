import { jobs } from "@/dummy_datas/jobDetails";
import JobCard from "@/shared/components/JobCard";

const JobList = () => {
  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} {...job} />)
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

import { client, jobHeaderData, jobs } from "@/dummy_data/jobDetails";
import { useParams } from "react-router-dom";
import MyJobsHeader from "../../../shared/components/MyJobsHeader";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import JobHeaderCard from "./job_details_components/JobHeaderCard";
import JobTabSection from "./job_details_components/JobTabSection";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const { jobId } = useParams();

  const filter = () => {
    return jobs.filter((job) => {
      return job.id === jobId;
    });
  };

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => {}}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobHeaderData.title}
              client={jobHeaderData.client}
              duration={jobHeaderData.duration}
              type={filter()[0].type}
              status={filter()[0].status}
            />
            <JobTabSection status={filter()[0].status as JobStatus} />
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={client.name}
              memberSince={client.memberSince}
              location={client.location}
              rating={client.rating}
              reviews={client.reviews}
              verifications={client.verifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

import { engineersList, jobData } from "@/dummy_data/admin/myjob_datas";
import ContactDetailsCard from "@/shared/components/manage_job_components/ContactDetailsCard";
import JobStatusCard from "@/shared/components/manage_job_components/JobStatusCard";
import ManageJobDetails from "./ManageJobDetails";

/**
 * JobDetails Component
 *
 * Displays a job details page with job information, job status, and contact details.
 * Uses ManageJobDetails component for job details and job status card.
 *
 * @component
 * @example
 * <JobDetails />
 */
const JobDetails = () => {
  // const id = useParams();
  const id = "#Ride002";

  const findJobValue = () => {
    return jobData.find((job) => job.id === String(id));
  };

  const infoData = [
    { label: "Job Title", value: findJobValue()?.title },
    {
      label: "Job Description",
      value: findJobValue()?.description,
    },
    { label: "Job Type", value: findJobValue()?.jobType },
    { label: "Service Category", value: findJobValue()?.category },
    { label: "Job Price", value: findJobValue()?.salary },
    { label: "Country", value: findJobValue()?.country },
    { label: "State", value: findJobValue()?.state },
    { label: "City", value: findJobValue()?.city },
    { label: "No of Engineers", value: findJobValue()?.count },
  ];

  const handleStatusChange = () => {
    alert("Job marked as completed!");
  };

  const handleAssignEngineer = (engineerId: string) => {
    alert(`Engineer ${engineerId} assigned to job #Ride001`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div className="flex justify-between w-full flex-wrap gap-4">
          <JobStatusCard
            jobId={findJobValue()?.id || "N/A"}
            date={
              new Date(findJobValue()?.createdDate || "2024-11-01T16:36:49")
            }
            status={findJobValue()?.status || "completed"}
            onStatusChange={handleStatusChange}
            
          />
          <ContactDetailsCard
            client={findJobValue()?.clientDetails}
            engineers={findJobValue()?.engineerDetails || []}
            onEngineerAssign={handleAssignEngineer}
            engineersList={engineersList}
          />
          <ManageJobDetails job={infoData} />
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

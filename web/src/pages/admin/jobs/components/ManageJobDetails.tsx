import { InfoGrid } from "@/shared/components/manage_job_components/infoCardComponent";

export default function ManageJobDetails({ job }: { job: any }) {


  return (
    <div className="p-6 ">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Job Details
      </h2>
      <InfoGrid items={job} columns={3} />
    </div>
  );
}

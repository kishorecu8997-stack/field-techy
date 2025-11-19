import { InfoGrid } from "@/shared/components/manage_job_components/infoCardComponent";

/**
 * ManageJobDetails Component
 *
 * Displays a job details page with job information, job status, and contact details.
 * Uses InfoGrid component for job details and job status card.
 *
 * @component
 * @example
 * <ManageJobDetails job={job} />
 */
export default function ManageJobDetails({ job }: { job: any }) {
  return (
    <div className="p-6 ">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Job Details
      </h2>
      <InfoGrid items={job} columns={3} key={""} />
    </div>
  );
}

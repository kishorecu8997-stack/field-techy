import {
  job,
  logs,
  otherProposal,
  requirements,
  termsData,
  workSubmissions,
} from "@/dummy_data/jobDetails";
import { JOB_STATUSES, type JobStatus } from "@/pages/engineer/search_result/types";
import TabComponent from "@/shared/components/TabComponent";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import LogComponent from "./tab_components/LogComponent";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
import Proposal from "@/shared/components/Proposal";

/**
 * Renders a tabbed section for job details based on the current job status.
 *
 * This component conditionally displays various tabs such as Logs, Work Submissions,
 * Job Information, Requirements, SPOC Details, Other Proposals, and Terms & Conditions.
 * Certain tabs (e.g., Logs and Work Submissions) are hidden when the job status is 'applied'.
 *
 * @param {Object} props - The component props.
 * @param {JobStatus} props.status - The current status of the job (e.g., 'applied', 'in_progress').
 * @returns {JSX.Element} A tabbed interface containing job-related information sections.
 *
 * @example
 * <JobTabSection status={JOB_STATUSES.in_progress} />
 */
const JobTabSection = ({ status }: { status: JobStatus }) => {
  const tabs = [
    {
      label: "Logs",
      content: <LogComponent logs={logs} />,
      hide: status === JOB_STATUSES.applied,
    },
    {
      label: "Work Submissions",
      content: <WorkSubmissionComponent workSubmissions={workSubmissions} />,
      hide: status === JOB_STATUSES.applied,
    },
    {
      label: "Job Information",
      content: <JobInfoSection jobInfo={job} />,
    },
    {
      label: "Requirement",
      content: (
        <Proposal jobTitle={requirements.jobTitle} terms={requirements.terms} />
      ),
    },
    {
      label: "SPOC Details",
      content: <LocationMap />,
    },
    {
      label: "Other",
      content: (
        <Proposal
          jobTitle={otherProposal.jobTitle}
          terms={otherProposal.terms}
        />
      ),
    },
    {
      label: "Proposal's Terms & Conditions",
      content: (
        <Proposal jobTitle={termsData.jobTitle} terms={termsData.terms} />
      ),
    },
  ];

  return (
    <div className="">
      <TabComponent tabs={tabs} defaultActiveTab="Job Information" />
    </div>
  );
};

export default JobTabSection;

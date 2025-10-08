import {
  job,
  logs,
  OtherProposal,
  Requirements,
  termsData,
  workSubmissions,
} from "@/dummy_datas/jobDetails";
import { JOB_STATUSES, type JobStatus } from "@/pages/serch_result/types";
import TabComponent from "@/shared/components/TabComponent";
import Proposal from "../../../shared/components/Proposal";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import LogComponent from "./tab_components/LogComponent";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
// import LocationMap from "./tab_components/LocationMap";

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
        <Proposal jobTitle={Requirements.jobTitle} terms={Requirements.terms} />
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
          jobTitle={OtherProposal.jobTitle}
          terms={OtherProposal.terms}
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

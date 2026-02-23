import AdminTabComponent from "@/shared/components/AdminTabComponent";
import AppliedJob from "./AppliedJobs";
import InvitedJob from "./InvitedJob";
import CompletedJob from "./CompletedJob";
import DeclinedJob from "./DeclinedJob";
import HoldJob from "./HoldJob";
import InprogressJob from "./InprogressJob";

/**
 * EngineerJobCategory
 *
 * Top-level tabbed view that groups different job lists for a single engineer.
 * Each tab renders a table or list representing a particular job state:
 * - Applied Jobs
 * - Inprogress Jobs
 * - Invited Jobs
 * - Completed Jobs
 * - Declined Jobs
 * - Hold Jobs
 *
 * Responsibilities:
 * - Compose `AdminTabComponent` with pre-configured tabs and content components
 * - Provide a single entry point for job-related views in the engineer details page
 *
 * Notes:
 * - Tabs' content components (e.g. `AppliedJob`, `CompletedJob`) are self-contained
 *   and manage their own data and state. To make this component more flexible,
 *   consider passing an external `data` prop or tab configuration.
 *
 * @component
 * @returns {JSX.Element} A tabbed container of job category views for an engineer
 */
export default function EngineerJobCategory() {
  const tabs = [
    {
      label: "Applied Jobs",
      content: <AppliedJob />,
      hide: false,
    },
    {
      label: "Inprogress Jobs",
      content: <InprogressJob />,
      hide: false,
    },
    {
      label: "Invited Jobs",
      content: <InvitedJob />,
      hide: false,
    },
    {
      label: "Completed Jobs",
      content: <CompletedJob />,
      hide: false,
    },
    {
      label: "Declined Jobs",
      content: <DeclinedJob />,
      hide: false,
    },
    {
      label: "Hold Jobs",
      content: <HoldJob />,
      hide: false,
    },
  ];

  return (
    <div>
      <AdminTabComponent tabs={tabs} defaultActiveTab={"Applied Jobs"} />
    </div>
  );
}

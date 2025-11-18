import React from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import PostedJobs from "./PostedJobs";
import InProgressJobs from "./InProgressJobs";
import HoldJobs from "./HoldJobs";
import FlaggedJobs from "./FlaggedJobs";
import DeclinedJobs from "./DeclinedJobs";
import CompletedJobs from "./CompletedJobs";

/**
 * JobHistory Component
 *
 * This component displays the job history for a client, organized into different status categories using a tabbed interface.
 * It utilizes the `AdminTabComponent` to render tabs for various job statuses.
 *
 * - The "Posted Jobs" tab displays the `<PostedJobs />` component.
 * - The "In Progress Jobs" tab displays the `<InProgressJobs />` component.
 * - The "Completed Jobs" tab displays the `<CompletedJobs />` component.
 * - The "Hold Jobs" tab displays the `<HoldJobs />` component.
 * - The "Flagged Jobs" tab displays the `<FlaggedJobs />` component.
 * - The "Declined Jobs" tab displays the `<DeclinedJobs />` component.
 * @component
 * @returns {JSX.Element} The rendered JobHistory component with tabbed navigation for different job statuses.
 */
const JobHistory: React.FC = () => {
  const tabs = [
    {
      label: "Posted Jobs",
      content: <PostedJobs />,
    },
    {
      label: "In Progress Jobs",
      content: <InProgressJobs />,
    },
    {
      label: "Completed Jobs",
      content: <CompletedJobs />,
    },
    {
      label: "Hold Jobs",
      content: <HoldJobs />,
    },
    {
      label: "Flagged Jobs",
      content: <FlaggedJobs />,
    },
    {
      label: "Declined Jobs",
      content: <DeclinedJobs />,
    },
  ];
  return (
   <div className="bg-white dark:bg-gray-700 rounded-lg p-2">      
        <AdminTabComponent tabs={tabs} defaultActiveTab="Posted Jobs" />      
    </div>
  );
};

export default JobHistory;

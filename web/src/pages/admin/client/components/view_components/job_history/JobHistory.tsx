import React from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import PostedJobs from "./PostedJobs";
import InProgressJobs from "./InProgressJobs";
import HoldJobs from "./HoldJobs";
import FlaggedJobs from "./FlaggedJobs";
import DeclinedJobs from "./DeclinedJobs";
import CompletedJobs from "./CompletedJobs";

/**
 * ManageClient Component
 *
 * This component serves as the main page for managing clients within the admin dashboard.
 * It utilizes a tabbed interface to separate and display different categories of clients,
 * specifically "Corporate" and "Home" clients.
 *
 * - Renders a main title for the page.
 * - Implements `AdminTabComponent` to create a tabbed navigation.
 * - The "Corporate" tab displays the `<CorporateClient />` component.
 * - The "Home" tab displays the `<HomeClient />` component.
 * @component
 * @returns {JSX.Element} The rendered ManageClient page with tabbed navigation.
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
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Posted Jobs" />
      </div>
    </div>
  );
};

export default JobHistory;

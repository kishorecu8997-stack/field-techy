import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import CompletedJob from "./jobCatagory/CompletedJob";
import DeclinedJob from "./jobCatagory/DeclinedJob";
import HoldJob from "./jobCatagory/HoldJob";
import AllJob from "./jobCatagory/AllJobs";
import FlaggedJob from "./jobCatagory/FlaggedJob";
import InProgressJob from "./jobCatagory/InprogressJob";

/**
 * Renders the main page for managing jobs in the admin dashboard.
 *
 * This component sets up a tabbed interface to display different categories of jobs,
 * such as "All Jobs", "In Progress", "Completed", etc. It also includes
 * a header with the page title and an "Export CSV" button.
 *
 * @returns {JSX.Element} The rendered manage jobs page.
 */
export default function ManageJobs() {
  const tabs = [
    {
      label: "All Jobs",
      content: <AllJob />,
      hide: false,
    },
    {
      label: "In Progress",
      content: <InProgressJob />,
      hide: false,
    },
    {
      label: "Completed",
      content: <CompletedJob />,
      hide: false,
    },
    {
      label: "Declined",
      content: <DeclinedJob />,
      hide: false,
    },
    {
      label: "Hold Jobs",
      content: <HoldJob />,
      hide: false,
    },
    {
      label: "Flagged Jobs",
      content: <FlaggedJob />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between mt-2">
        <h1 className="font-semibold">Manage Jobs</h1>
        <div className="flex gap-4">
          <Button variant="solid" className="">
            Export CSV
          </Button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab={"All Jobs"} />
      </div>
    </div>
  );
}

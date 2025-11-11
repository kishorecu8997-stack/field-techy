import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import ApprovedTable from "./ApprovedTable";
import PendingTable from "./PendingTable";
import RejectedTable from "./RejectedTable";

/**
 * ManageTransactions Component
 *
 * @component
 * @description Displays and manages different types of transaction tabs including
 * Engineer Payouts, Milestone Approvals, Dispute Resolutions, and Refunds.
 * Includes an option to export data as CSV.
 *
 * @returns {JSX.Element} The Manage Transactions admin panel.
 */
export default function WalletTransactionRequests() {
  const tabs = [
    {
      label: "Pending",
      content: <PendingTable />,
      hide: false,
    },
    {
      label: "Approved",
      content: <ApprovedTable />,
      hide: false,
    },
    {
      label: "Rejected",
      content: <RejectedTable />,
      hide: false,
    },
   
  ];

  return (
    <div className="flex flex-col h-full w-full p-4 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold ">Transaction Requests</h1>
        <Button className="whitespace-nowrap bg-neutral-900 dark:bg-neutral-500">
          Export CSV
        </Button>
      </div>
      <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg p-2">
        <div className="flex p-2 w-full h-full">
          <AdminTabComponent tabs={tabs} defaultActiveTab="Pending" />
        </div>
      </div>
    </div>
  );
}


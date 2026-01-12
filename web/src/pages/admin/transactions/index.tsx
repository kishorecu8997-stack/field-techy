import AdminTabComponent from "@/shared/components/AdminTabComponent";
import EngineerPayout from "./engineer_payout";
import { Button } from "@/shared/components/commonUI/Buttons";

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
export default function ManageTransactions() {
  const tabs = [
    {
      label: "Engineer Payout",
      content: <EngineerPayout />,
      hide: false,
    },
    {
      label: "Milestone Approval Transactions",
      content: <EngineerPayout />,
      hide: false,
    },
    {
      label: "Dispute Resolution Transactions",
      content: <EngineerPayout />,
      hide: false,
    },
    {
      label: "Refunded Transactions",
      content: <EngineerPayout />,
      hide: false,
    },
  ];

  const handleCSVExport = () => {
    // Implement CSV export functionality here
    console.log("Exporting data as CSV...");
  };

  return (
    <div className="flex flex-col h-full w-full p-4 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Manage Transactions</h1>
        <Button variant="solid" onClick={handleCSVExport}>
          Export CSV
        </Button>
      </div>
      <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg p-2">
        <div className="flex p-2 w-full h-full">
          <AdminTabComponent tabs={tabs} defaultActiveTab="Engineer Payout" />
        </div>
      </div>
    </div>
  );
}

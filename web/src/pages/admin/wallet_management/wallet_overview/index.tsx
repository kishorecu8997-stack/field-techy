import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import EngineerWallet from "./engineer_pages";

/**
 * WalletOverview Component
 *
 * @component
 * @description Displays and manages different types of transaction tabs including
 * Engineer Payouts, Milestone Approvals, Dispute Resolutions, and Refunds.
 */
export default function WalletOverview() {
  const tabs = [
    {
      label: "Engineer",
      content: <EngineerWallet />,
      hide: false,
    },
    {
      label: "Client",
      content: <EngineerWallet />,
      hide: false,
    },
   
  ];

  return (
    <div className="flex flex-col h-full w-full p-4 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold ">Wallet Management</h1>
        <Button className="whitespace-nowrap bg-neutral-900 dark:bg-neutral-500">
          Export CSV
        </Button>
      </div>
      <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg p-2">
        <div className="flex p-2 w-full h-full">
          <AdminTabComponent tabs={tabs} defaultActiveTab="Engineer" />
        </div>
      </div>
    </div>
  );
}

import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import EngineerWallet from "./engineer_pages";
import ClientWallet from "./client_pages";

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
      label: "Client",
      content: <ClientWallet />,
      hide: false,
    },
    {
      label: "Engineer",
      content: <EngineerWallet />,
      hide: false,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full p-4 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Wallet Management</h1>
        <Button variant="solid">Export CSV</Button>
      </div>
      <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg p-2">
        <div className="flex p-2 w-full h-full">
          <AdminTabComponent tabs={tabs} defaultActiveTab="Client" />
        </div>
      </div>
    </div>
  );
}

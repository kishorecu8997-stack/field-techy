
import useDrawerStore from "@/shared/store/useDrawerStore";
import TransactionDashboard from "./TransactionDashboard";
import { Button } from "@/shared/components/commonUI/Buttons";
import { set } from "react-hook-form";

/**
 * Displays the user's current balance with quick actions (Bank Details, Withdraw) and a transaction history dashboard.
 * Uses dummy transaction data and integrates with the drawer store for navigation.
 */
const MyEarning = () => {
  const { setActiveKey } = useDrawerStore();

  const currentBalance = 1000;

  const BankSection = () => {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
        <h1 className="text-4xl font-bold mt-1">
          ${currentBalance.toFixed(2)}
        </h1>
        <div className="mt-4 flex gap-3 justify-center">
          <Button
            onClick={() => setActiveKey("manageBankAccounts")}
            className="px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition"
          >
            Bank Details
          </Button>
          <Button
            onClick={() => setActiveKey("withdraw")}
            className="px-6 py-3 bg-emerald-800 text-white rounded-full font-medium hover:bg-emerald-700 transition"
          >
            Withdraw
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-[25%] ">
        <BankSection />
      </div>
      <div className="h-[75%] overflow-y-auto">
        <TransactionDashboard
          onViewAllClick={() => {setActiveKey("engineerRecentTransactions")}}
        />
      </div>
    </div>
  );
};

export default MyEarning;

import { Button } from "@/shared/components/commonUI/Buttons";
import useDrawerStore from "@/shared/store/useDrawerStore";
import TransactionDashboard from "./TransactionDashboard";
import BestPayingJobs from "./BestPayingJobs";
import TotalEarningsSummary from "./TotalEarningsSummary";
import EarningHistoryChart from "./EarningHistoryChart";
import MonthlyComparison from "./MonthlyComparison";
import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useEngineerBalance } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { formatCurrency } from "@/shared/libs/utils";

/**
 * Displays the user's current balance with quick actions (Bank Details, Withdraw) and a transaction history dashboard.
 * Uses dummy transaction data and integrates with the drawer store for navigation.
 */
const MyEarning = () => {
  const { setActiveKey } = useDrawerStore();
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const { data: balanceArr } = useEngineerBalance();
  const balance = balanceArr?.[0];
  const formattedBalance = showBalance
    ? (() => {
        const amount = Number(balance?.balance);
        const currency = balance?.currencyCode ?? "USD";
        return isNaN(amount) ? "$0.00" : formatCurrency(amount, currency);
      })()
    : "******";

  const BankSection = () => {
    return (
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current Balance
        </p>
        <div className="flex justify-between items-center">
          <p className="text-2xl md:text-3xl items-center font-extrabold text-gray-900 dark:text-white">
            <span>{formattedBalance}</span>
          </p>
          {!showBalance ? (
            <BsEyeFill
              className="cursor-pointer text-lg"
              onClick={() => setShowBalance(true)}
              role="button"
              aria-label="Show balance"
              tabIndex={0}
              onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowBalance((prev) => !prev);
                }
              }}
            />
          ) : (
            <BsEyeSlashFill
              className="cursor-pointer text-lg"
              onClick={() => setShowBalance(false)}
              role="button"
              aria-label="Hide balance"
              tabIndex={0}
              onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowBalance((prev) => !prev);
                }
              }}
            />
          )}
        </div>
        <div className="mt-4 flex gap-3 justify-center">
          <Button
            onClick={() => setActiveKey("manageBankAccounts")}
            className="px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition dark:bg-transparent dark:border dark:border-teal-600 dark:text-white"
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
        <div className="pt-4">
          <TotalEarningsSummary />
        </div>
        <div className="pt-4">
          <TransactionDashboard
            onViewAllClick={() => {
              setActiveKey("engineerRecentTransactions");
            }}
          />
        </div>
        <div className="pt-4">
          <BestPayingJobs />
        </div>

        <div className="pt-4">
          <EarningHistoryChart />
        </div>
        <div className="pt-4">
          <MonthlyComparison />
        </div>
      </div>
    </div>
  );
};

export default MyEarning;

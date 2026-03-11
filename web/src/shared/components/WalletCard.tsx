import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import useDrawerStore from "../store/useDrawerStore";
import { Button } from "./commonUI/Buttons";
import Drawer from "./drawer/Drawer";
import { useState } from "react";
import { useClientBalance } from "../apiServices/client/clientOpenApiService";
import AddFundComponent from "@/pages/client/my_wallet/components/AddFundComponent";

/**
 * A card component that displays the user's wallet balance and provides
 * actions to add funds or view transactions. These actions open a drawer
 * with the corresponding content.
 *
 * @component
 * @returns {JSX.Element} The rendered WalletCard component.
 */
export const WalletCard: React.FC = () => {
  const { setActiveKey, setISOpenSidebar, isOpenSidebar } = useDrawerStore();
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const { data: balanceArr } = useClientBalance();
  const balance = balanceArr?.[0];

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          My Wallet
        </h3>
        <Button
          variant="text"
          onClick={() => {
            setActiveKey("clientWallet");
            setISOpenSidebar(true);
          }}
          className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          View all
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Current Balance
        </p>
        <div className="flex justify-between items-center">
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            {showBalance
              ? balance?.balance != null
                ? Number(balance.balance).toLocaleString("en-US", {
                    style: "currency",
                    currency: balance.currencyCode ?? "INR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"
              : "******"}
          </p>

          {!showBalance ? (
            <BsEyeFill
              className="cursor-pointer text-lg"
              role="button"
              tabIndex={0}
              aria-label="Show balance"
              onClick={() => setShowBalance(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowBalance(true);
                }
              }}
            />
          ) : (
            <BsEyeSlashFill
              className="cursor-pointer text-lg"
              role="button"
              tabIndex={0}
              aria-label="Hide balance"
              onClick={() => setShowBalance(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowBalance(false);
                }
              }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AddFundComponent buttonWidth="w-full" />
        <Button
          variant="primary"
          onClick={() => {
            setISOpenSidebar(true);
            setActiveKey("recentTransactions");
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
        >
          Transactions
        </Button>
      </div>
      <Drawer
        isOpen={isOpenSidebar}
        onClose={() => setISOpenSidebar(false)}
      ></Drawer>
    </div>
  );
};

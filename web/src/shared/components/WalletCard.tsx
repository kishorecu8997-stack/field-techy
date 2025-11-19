import { Button } from "./commonUI/Buttons";

interface EarningsData {
  balance: number;
}

/**
 * Props for the WalletCard component.
 */
interface WalletCardProps {
  earnings: EarningsData;
  onDrawerToggle: (componentName: string) => void;
}

const WALLET_COMPONENTS = {
  MY_WALLET: "clientWallet",
  ADD_FUND: "clientAddFund",
  RECENT_TRANSACTIONS: "recentTransactions",
};

/**
 * A card component that displays the user's wallet balance and provides
 * actions to add funds or view transactions. These actions open a drawer
 * with the corresponding content.
 *
 * @component
 * @param {WalletCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered WalletCard component.
 */
export const WalletCard: React.FC<WalletCardProps> = ({ earnings, onDrawerToggle }) => {
    
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">My Wallet</h3>
        <Button
        variant="text"
           onClick={()=>onDrawerToggle(WALLET_COMPONENTS.MY_WALLET)}
          className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          View all
        </Button>
      </div>

      <div className="text-center mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Current Balance</p>
        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
          ${earnings.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="primary"
         className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          onClick={()=>onDrawerToggle(WALLET_COMPONENTS.ADD_FUND)}
        >
          Add Fund
        </Button>
        <Button variant="primary"
          onClick={() => onDrawerToggle(WALLET_COMPONENTS.RECENT_TRANSACTIONS)}
          className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Transactions
        </Button>
      </div>
    </div>
  );
};
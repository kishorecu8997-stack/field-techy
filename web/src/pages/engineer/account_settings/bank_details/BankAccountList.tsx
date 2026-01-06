import { bankDetails } from "@/dummy_data/bankDetails";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Displays a list of saved bank accounts with options to add or edit details.
 * Uses dummy data and handles navigation via the drawer store's `setActiveKey` method.
 */
const BankAccountList: React.FC<DrawerMenuProps> = () => {
  const { setActiveKey } = useDrawerStore();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-end">
        <div
          onClick={() => setActiveKey("addBankdetails", true)}
          className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium transition-colors underline-offset-2 hover:underline cursor-pointer"
          aria-label="Add Bank"
        >
          Add Bank
        </div>
      </div>

      {bankDetails.map((bank, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {bank.bankName}
            </h3>
            <div
              onClick={() => setActiveKey("editBankdetails", true)}
              className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium transition-colors underline-offset-2 hover:underline cursor-pointer"
              aria-label={`Edit details for ${bank.bankName}`}
            >
              Edit details
            </div>
          </div>

          <div className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
            <div>
              Account Number:{" "}
              <span className="font-mono">{bank.accountNumber}</span>
            </div>
            <div>
              SWIFT Code: <span className="font-mono">{bank.swiftcode}</span>
            </div>
            <div>
              IBAN: <span className="font-mono">{bank.iban}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BankAccountList;

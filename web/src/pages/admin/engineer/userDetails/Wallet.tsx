import {
  TRANSACTION_STATUS,
  transactions,
  type TransactionProps,
} from "@/dummy_data/admin/manageEngineer";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { BANK_CARD_DATA } from "../types";

/**
 * @component Wallet
 * @description Renders the financial details for an engineer in three main sections:
 * 1. Bank and card details (including bank name, address, IBAN, SWIFT code, and card number),
 * 2. Current wallet balance,
 * 3. A table of recent transactions with status indicators.
 *
 * This component uses dummy data for demonstration purposes.
 *
 * @returns {JSX.Element} The rendered wallet page section.
 */
export default function Wallet() {
  const data = BANK_CARD_DATA;

  const columns: Column<TransactionProps>[] = [
    { key: "id", label: "Sr.No" },
    { key: "date", label: "Date & Time" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "type", label: "Transaction Type" },
    { key: "amount", label: "Amount" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: TransactionProps) => {
        const statusClass =
          row.status === TRANSACTION_STATUS.success
            ? "text-green-600 bg-green-100"
            : row.status === TRANSACTION_STATUS.failed
            ? "text-red-600 bg-red-100"
            : "text-yellow-600 bg-yellow-100";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8">
      <div className="text-sm border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="font-semibold text-gray-700 dark:text-white mb-4">
          Card Detail
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Bank Name
              </label>
              <p className="font-semibold">{data.bankName}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Card Number
              </label>
              <p className="font-semibold">{data.cardNumber}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Bank Address
              </label>
              <p className="text-sm leading-tight">{data.bankAddress}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                IBAN Number
              </label>
              <p className="font-semibold">{data.ibanNumber}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Card Holder Name
              </label>
              <p className="font-semibold text-gray-500">
                {data.cardHolderName}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Swift Code
              </label>
              <p className="font-semibold">{data.swiftCode}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-2 mt-6 items-center">
        <p className="text-gray-500">Wallet Balance : </p>
        <span className="font-semibold text-[#666666]">
          {data.walletBalance}
        </span>
      </div>

      <div className="h-full flex-1 overflow-y-auto">
        <CustomTable<TransactionProps>
          columns={columns}
          data={transactions}
          initialPageSize={10}
        />
      </div>
    </div>
  );
}

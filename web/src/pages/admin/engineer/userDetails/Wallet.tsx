import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { BANK_CARD_DATA } from "../types";
import { useAdminGetEngineerHistory } from "@/shared/apiServices/admin/adminOpenApiService";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";

interface WalletTransaction {
  transactionTime: string;
  transactionId: string;
  transactionType: "credit" | "debit";
  amount: number;
  status: "pending" | "approved" | "rejected";
}

/**
 * Wallet Component
 * Integrates real backend "wallet" transactions
 * Displays card details and a paginated transaction history table
 * Fetches data using engineer ID from URL parameters
 * Handles loading and error states gracefully
 */
export default function Wallet() {
  const data = BANK_CARD_DATA;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const params = useParams();
  const userId = Number(params.id);
  const hasValidUserId = Number.isFinite(userId) && userId > 0;

  const {
    data: walletHistory,
    isLoading,
    error,
  } = useAdminGetEngineerHistory(
    hasValidUserId ? userId : 0,
    {
      page,
      limit,
      type: "wallet",
    },
    { enabled: hasValidUserId },
  );

  const transactions: WalletTransaction[] = useMemo(
    () => (walletHistory?.data ?? []) as WalletTransaction[],
    [walletHistory?.data],
  );

  // Table Columns
  const columns: Column<WalletTransaction>[] = [
    {
      key: "sr",
      label: "Sr.No.",
      renderCell: (_row, index) => (page - 1) * limit + index + 1,
    },

    {
      key: "transactionTime",
      label: "Date & Time",
      renderCell: (row) =>
        row.transactionTime
          ? new Date(row.transactionTime).toLocaleString()
          : "N/A",
    },

    { key: "transactionId", label: "Transaction ID" },

    {
      key: "transactionType",
      label: "Type",
      renderCell: (row) => (
        <span className="capitalize font-semibold">{row.transactionType}</span>
      ),
    },

    {
      key: "amount",
      label: "Amount",
      renderCell: (row) => (
        <span className="font-medium">₹{row.amount.toLocaleString()}</span>
      ),
    },

    {
      key: "status",
      label: "Status",
      renderCell: (row) => {
        const color =
          row.status === "approved"
            ? "bg-green-100 text-green-600"
            : row.status === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${color}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8">
      {/* CARD/BANK SECTION (dummy retained as requested) */}
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

      {/* Wallet Balance */}
      <div className="flex gap-2 mb-2 mt-6 items-center">
        <p className="text-gray-500">Wallet Balance:</p>
        <span className="font-semibold text-[#666666]">
          ₹{data.walletBalance}
        </span>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="h-full flex-1 overflow-y-auto">
        <CustomTable<WalletTransaction>
          columns={columns}
          data={transactions}
          loading={isLoading}
          error={
            !hasValidUserId
              ? "Missing engineer ID in URL."
              : error
                ? "Failed to fetch wallet transactions."
                : null
          }
          totalCount={walletHistory?.total ?? 0}
          currentPage={page}
          onPageChange={setPage}
          initialPageSize={limit}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}

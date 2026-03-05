import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
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
interface WalletProps {
  walletBalance?: number;
}

/**
 * Wallet Component
 * Integrates real backend "wallet" transactions
 * Displays a paginated wallet transaction history table
 * Fetches data using engineer ID from URL parameters
 * Handles loading and error states gracefully
 */
export default function Wallet({ walletBalance }: WalletProps) {
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
    <div className="p-1">
      {/* Wallet Balance */}
      <div className="flex gap-2 p-1 items-center">
        <p className="text-gray-500">Wallet Balance:</p>
        <span className="font-semibold text-[#666666]">
          {(walletBalance ?? 0).toLocaleString()}
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

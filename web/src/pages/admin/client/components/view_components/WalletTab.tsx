import React, { useMemo, useState } from "react";
import { useAdminGetClientHistory } from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";

interface WalletTabProps {
  userId: number;
  walletBalance?: number;
}

// Define the transaction structure based on API response expectations
type WalletTransaction = {
  id: number;
  transactionTime: string;
  transactionType: string;
  amount: string;
  status: string;
};

/**
 * WalletTab component displays the client's financial information.
 * It includes a searchable table of wallet transaction history using the `<CustomTable />` component.
 */
const WalletTab: React.FC<WalletTabProps> = ({ userId }) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = useState("");

  const { data: walletHistory, isLoading } = useAdminGetClientHistory(userId, {
    type: "wallet",
    page,
    limit,
  });

  const allTransactions = (walletHistory?.data || []) as WalletTransaction[];

  // Client-side search filtering
  const filteredTransactions = useMemo(() => {
    if (!search) return allTransactions;
    const query = search.toLowerCase();
    return allTransactions.filter(
      (txn) =>
        txn.transactionType?.toLowerCase().includes(query) ||
        txn.amount?.toLowerCase().includes(query) ||
        txn.status?.toLowerCase().includes(query) ||
        (txn.transactionTime &&
          dayjs(txn.transactionTime)
            .format("DD-MM-YYYY HH:mm:ss")
            .includes(query)),
    );
  }, [allTransactions, search]);

  const columns: Column<WalletTransaction>[] = [
    {
      label: "Sr.No.",
      renderCell: (_, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "transactionTime",
      label: "Date & Time",
      renderCell: (row) =>
        row.transactionTime
          ? dayjs(row.transactionTime).format("DD-MM-YYYY HH:mm:ss")
          : "N/A",
    },
    { key: "transactionType", label: "Transaction Type" },
    {
      key: "amount",
      label: "Amount",
      renderCell: (row) => (row.amount ? `₹${row.amount}` : "N/A"),
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row) => (
        <span
          className={`capitalize text-sm font-medium ${
            row.status === "approved"
              ? "text-green-600"
              : row.status === "rejected"
                ? "text-red-600"
                : row.status === "pending"
                  ? "text-yellow-600"
                  : "text-gray-600"
          }`}
        >
          {row.status || "N/A"}
        </span>
      ),
    },
  ];

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md">
      <div className="px-3 pt-3">
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <div className="h-full flex-1 overflow-y-auto p-3">
        <CustomTable<WalletTransaction>
          columns={columns}
          data={filteredTransactions}
          totalCount={
            search ? filteredTransactions.length : walletHistory?.total || 0
          }
          currentPage={page}
          initialPageSize={limit}
          loading={isLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default WalletTab;

import React from "react";
import { useAdminGetClientHistory } from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import { CustomTable, type Column } from "@/shared/components/commonUI/custom_table";

interface WalletTabProps {
  userId: number;
  walletBalance?: number;
}

// Define the transaction structure based on API response expectations
type WalletTransaction = {
  id: number;
  createdAt: string;
  transactionType: string;
  amount: string;
  status: string;
};

/**
 * WalletTab component displays the client's financial information.
 * It includes the client's bank and card details via the `<BankCardDetail />` component
 * and a table of their wallet transaction history using the `<CustomTable />` component.
 */
const WalletTab: React.FC<WalletTabProps> = ({ userId, walletBalance }) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data: walletHistory, isLoading } = useAdminGetClientHistory({
    userId,
    type: "wallet",
    page,
    limit,
  });

  const columns: Column<WalletTransaction>[] = [
    {
      label: "Sr.No.",
      renderCell: (_, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "createdAt",
      label: "Date & Time",
      renderCell: (row) =>
        row.createdAt ? dayjs(row.createdAt).format("DD-MM-YYYY HH:mm:ss") : "N/A",
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
        <span className="capitalize">{row.status || "N/A"}</span>
      ),
    },
  ];

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  const allTransactions = (walletHistory?.data || []) as WalletTransaction[];

  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md">
      <div className="h-full flex-1 overflow-y-auto p-3">
        <CustomTable<WalletTransaction>
          columns={columns}
          data={allTransactions}
          totalCount={walletHistory?.total || 0}
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

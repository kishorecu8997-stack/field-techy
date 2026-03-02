import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState, useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAdminGetTransactionRequests } from "@/shared/apiServices/admin/adminOpenApiService";

type TransactionRequest = {
  id: number;
  walletId: number;
  amount: string;
  type: "credit" | "debit";
  status: "pending" | "approved" | "rejected";
  description: string | null;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  clientEmail?: string;
  currencyCode?: string;
};

/**
 * RejectedTable Component
 *
 * Displays rejected transactions.
 * Automatically updates when status changes in PendingTable.
 *
 * Key: staleTime: 0 ensures this table refetches immediately
 * when invalidateQueries is called from the mutation hook.
 */

interface TableProps {
  active: boolean;
}
const RejectedTable: React.FC<TableProps> = ({ active }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useAdminGetTransactionRequests(
    {
      status: "rejected",
      limit,
      offset: (page - 1) * limit,
    },
    {
      enabled: active,
      staleTime: 0, // ✅ CRITICAL: Always refetch when invalidated
    },
  );

  const apiItems = data?.data ?? [];
  const total = data?.total ?? 0;

  const filteredData = useMemo(() => {
    if (!search.trim()) return apiItems;

    const term = search.toLowerCase().trim();

    return apiItems.filter((row) => {
      return (
        row.clientName?.toLowerCase().includes(term) ||
        row.clientEmail?.toLowerCase().includes(term) ||
        row.amount?.toLowerCase().includes(term) ||
        row.id.toString().includes(term) ||
        row.createdAt?.toLowerCase().includes(term)
      );
    });
  }, [apiItems, search]);

  const displayTotal = search.trim() ? filteredData.length : total;

  const columns: Column<TransactionRequest>[] = [
    {
      key: "sno",
      label: "Sr.No.",
      renderCell: (_row: TransactionRequest, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      key: "clientDetails",
      label: "Client Details",
      renderCell: (row: TransactionRequest) => (
        <div className="flex items-center gap-2">
          <div>
            <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div>
            <div className="font-semibold">{row.clientName || "—"}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.clientEmail || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
      renderCell: (row: TransactionRequest) => {
        const amount = Number(row.amount || 0);
        const currencyCode = row.currencyCode || "INR";

        const formattedAmount = new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "code", 
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(amount);

        return <span className="font-medium">{formattedAmount}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row: TransactionRequest) => {
        const status = row.status ?? "";
        return (
          <span className="text-red-600 font-medium">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date",
      renderCell: (row: TransactionRequest) => {
        if (!row.createdAt) return "—";

        return new Date(row.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="h-full w-full flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-md p-4 gap-4">
        <div className="flex justify-between items-center gap-4">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="h-full flex-1 overflow-hidden">
          {filteredData.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No rejected requests found
              {search.trim() && " matching your search"}
            </div>
          )}

          <CustomTable<TransactionRequest>
            columns={columns}
            data={filteredData}
            initialPageSize={limit}
            totalCount={displayTotal}
            currentPage={page}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RejectedTable;

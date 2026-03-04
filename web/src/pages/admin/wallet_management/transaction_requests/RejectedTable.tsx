import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminGetTransactionRequests(
    {
      status: "rejected",
      limit,
      offset: (page - 1) * limit,
    },
    {
      enabled: active,
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
        const currency = row.currencyCode || "-";

        return (
          <span className="font-medium">
            {currency} {""}
            {amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      renderCell: (row: TransactionRequest) => (
        <span className="text-red-600 font-medium capitalize">
          {row.status || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      renderCell: (row: TransactionRequest) => {
        if (!row.createdAt) return "—";

        return new Date(row.createdAt).toLocaleString("en-IN", {
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
        

          <CustomTable<TransactionRequest>
            columns={columns}
            data={filteredData}
            initialPageSize={limit}
            totalCount={displayTotal}
            currentPage={page}
            onPageChange={(newPage) => {
              setSearchParams(
                (prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", newPage.toString());
                  return next;
                },
                { replace: true },
              );
            }}
            onPageSizeChange={(newLimit) => {
              setSearchParams(
                (prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", "1");
                  next.set("limit", newLimit.toString());
                  return next;
                },
                { replace: true },
              );
            }}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RejectedTable;
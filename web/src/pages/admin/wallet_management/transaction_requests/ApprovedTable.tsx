import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAdminGetPendingPayments } from "@/shared/apiServices/admin/adminOpenApiService";
import { formatAmount } from "@/utils/currency";


type TransactionRequest = {
  assignmentId: number;
  jobId: number;
  jobCode: string;
  jobTitle: string;
  amount: string;
  engineerId: number;
  engineerName: string;
  engineerProfileUrl?: string | null;
  submittedAt?: string | null;
  currencySymbol: string;
};

/**
 * ApprovedTable Component
 *
 * Displays approved transactions.
 * Automatically updates when status changes in PendingTable.
 *
 * Key: staleTime: 0 ensures this table refetches immediately
 * when invalidateQueries is called from the mutation hook.
 */
interface TableProps {
  active: boolean;
}
const ApprovedTable: React.FC<TableProps> = ({ active }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminGetPendingPayments(
    {
      status: "approved",
      limit,
      page,
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
        row.engineerName?.toLowerCase().includes(term) ||
        row.jobTitle?.toLowerCase().includes(term) ||
        row.jobCode?.toLowerCase().includes(term) ||
        row.amount?.toLowerCase().includes(term) ||
        row.jobId.toString().includes(term) ||
        row.assignmentId.toString().includes(term) ||
        row.submittedAt?.toLowerCase().includes(term) ||
        row.currencySymbol?.toLowerCase().includes(term)
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
      key: "engineerDetails",
      label: "Engineer Details",
      renderCell: (row: TransactionRequest) => (
        <div className="flex items-center gap-2">
          <div>
            {row.engineerProfileUrl ? (
              <img src={row.engineerProfileUrl} alt="profile" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            )}
          </div>
          <div>
            <div className="font-semibold">{row.engineerName || "—"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "jobDetails",
      label: "Job Details",
      renderCell: (row: TransactionRequest) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.jobCode || "—"}</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {row.jobTitle || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      renderCell: (row: TransactionRequest) => {
        const amountNum = Number(row.amount || 0);

        return (
          <span className="font-medium">
            {formatAmount(amountNum, row.currencySymbol)}
          </span>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      renderCell: () => (
        <span className="text-green-600 font-medium capitalize">
          Approved
        </span>
      ),
    },

    {
      key: "submittedAt",
      label: "Date",
      renderCell: (row: TransactionRequest) => {
        if (!row.submittedAt) return "—";

        return new Date(row.submittedAt).toLocaleString("en-IN", {
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

export default ApprovedTable;

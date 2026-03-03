import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import React, { useState, useMemo, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import { usePopupStore } from "@/shared/store/popupStore";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import {
  useAdminGetTransactionRequests,
  useAdminUpdateTransactionRequestStatus,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { toast } from "react-toastify";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
/**
 * PendingTable Component
 *
 * Renders a table of transaction requests with client info, job details, and actions.
 * @returns {JSX.Element} The transaction requests management view.
 */

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

interface TransactionRequestsQueryData {
  data: TransactionRequest[];
  total: number;
}

interface TableProps {
  active: boolean;
}
const PendingTable: React.FC<TableProps> = ({ active }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useAdminGetTransactionRequests(
    {
      status: "pending",
      limit,
      offset: (page - 1) * limit,
    },
    {
      enabled: active,
      staleTime: 0,
    },
  );

  type ClosePopup = (success?: boolean) => void;

  const updateStatusMutation = useAdminUpdateTransactionRequestStatus({
    onSuccess: () => {
      toast.success("Status updated successfully!");
    },
    onError: (error) => {
      console.error("Status update error:", error);
      toast.error("Failed to update status. Please try again.");
    },
  });

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
        row.createdAt?.toLowerCase().includes(term) ||
        row.description?.toLowerCase().includes(term) ||
        row.type?.toLowerCase().includes(term)
      );
    });
  }, [apiItems, search]);

  const displayTotal = search.trim() ? filteredData.length : total;

  const handleStatusChange = useCallback(
    async (row: TransactionRequest, newStatus: "approved" | "rejected") => {
      if (!newStatus || newStatus === row.status) return;

      const queryKey: QueryKey = [
        "adminGetTransactionRequests",
        {
          status: "pending",
          limit,
          offset: (page - 1) * limit,
        },
      ];

      const previousData =
        queryClient.getQueryData<TransactionRequestsQueryData>(queryKey);

      queryClient.setQueryData<TransactionRequestsQueryData>(
        queryKey,
        (old) => {
          if (!old) {
            return old;
          }

          const updatedData = {
            ...old,
            data: old.data.filter((item) => item.id !== row.id),
            total: Math.max(0, old.total - 1),
          };

          return updatedData;
        },
      );

      await showPopup({
        title: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} Request`,
        body: `Are you sure you want to ${newStatus} this request?`,
        actionButtons: [
          {
            label: "Cancel",
            value: null,
            variant: "outline",
            action: async (close: ClosePopup) => {
              queryClient.setQueryData(queryKey, previousData);

              close(false);
            },
          },
          {
            label: "Yes",
            value: "yes",
            variant:
              newStatus.toLowerCase() === "approved" ? "primary" : "danger",
            action: async (close: ClosePopup) => {
              try {
                await updateStatusMutation.mutateAsync({
                  query: { id: row.id },
                  body: {
                    status: newStatus,
                  },
                });
                refetch();

                close(true);
              } catch (error) {
                console.error("❌ API call failed:", error);

                queryClient.setQueryData(queryKey, previousData);

                close(false);
              }
            },
          },
        ],
      });
    },
    [queryClient, showPopup, updateStatusMutation, page, limit],
  );

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
        const currency = row.currencyCode || "₹";
        return (
          <span className="font-medium">
            {currency}
            {Number(row.amount || 0).toLocaleString("en-IN")}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row: TransactionRequest) => (
        <div className="relative w-full">
          <SelectMenu
            placeholder="Select Action"
            value={row.status || ""}
            onChange={(value: string | null) => {
              if (!value || value === row.status) return;

              const lowerValue = value.toLowerCase();
              const normalizedStatus =
                lowerValue === "approve"
                  ? "approved"
                  : lowerValue === "reject"
                    ? "rejected"
                    : null;
              if (!normalizedStatus) return;

              handleStatusChange(row, normalizedStatus);
            }}
            options={JobStatus.filter((opt) => opt.value !== "pending").map(
              (opt) => ({
                ...opt,
                className:
                  opt.value === "approved"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300",
              }),
            )}
            badge
            disabled={updateStatusMutation.isPending}
          />
        </div>
      ),
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
            loading={isLoading || updateStatusMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingTable;

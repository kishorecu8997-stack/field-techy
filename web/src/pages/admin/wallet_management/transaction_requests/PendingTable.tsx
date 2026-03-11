import {
  useAdminGetWithdrawalRequests,
  useAdminWithdrawalAction,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { apiClient } from "@/shared/apiServices/apiClient";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";
import { formatAmount } from "@/utils/currency";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * PendingTable Component
 *
 * Renders a table of transaction requests with client info, job details, and actions.
 * @returns {JSX.Element} The transaction requests management view.
 */

type TransactionRequest = {
  transactionId: number;
  amount: string;
  currencySymbol: string;
  engineerId: number;
  engineerName: string;
  engineerProfileUrl?: string | null;
  status: string;
  requestedAt?: string | null;
};

interface TransactionRequestsQueryData {
  data: TransactionRequest[];
  total: number;
}

interface TableProps {
  active: boolean;
}

const PendingTable: React.FC<TableProps> = ({ active }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [search, setSearch] = useState("");

  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const { data, isLoading, refetch } = useAdminGetWithdrawalRequests(
    {
      limit,
      page,
      status: "pending",
    },
    {
      enabled: active,
    },
  );

  type ClosePopup = (success?: boolean) => void;

  const updateStatusMutation = useAdminWithdrawalAction({
    onSuccess: () => {
      toast.success("Payment action processed successfully!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to process payment action. Please try again.");
    },
  });

  const apiItems = data?.data ?? [];
  const total = data?.total ?? 0;

  const filteredData = useMemo(() => {
    if (!search.trim()) return apiItems;

    const term = search.toLowerCase().trim();

    return apiItems.filter((row) => {
      return (
        row.transactionId.toString().includes(term) ||
        row.engineerId.toString().includes(term) ||
        row.engineerProfileUrl?.toLowerCase().includes(term) ||
        row.engineerName?.toLowerCase().includes(term) ||
        row.amount?.toLowerCase().includes(term) ||
        row.currencySymbol?.toLowerCase().includes(term)||
        row.status?.toLowerCase().includes(term) ||
        row.requestedAt?.toLowerCase().includes(term)
      );
    });
  }, [apiItems, search]);

  const displayTotal = search.trim() ? filteredData.length : total;

  const handleStatusChange = useCallback(
    async (row: TransactionRequest, newStatus: "approve" | "reject") => {
      if (!newStatus) return;

      const queryKey = {
        client: apiClient,
        query: {
          limit,
          page,
          status: "pending",
          regionId: selectedRegionId ? Number(selectedRegionId) : undefined,
        },
      } as unknown as QueryKey;

      const previousData =
        queryClient.getQueryData<TransactionRequestsQueryData>(queryKey);

      queryClient.setQueryData<TransactionRequestsQueryData>(
        queryKey,
        (old) => {
          if (!old) return old;
          const updatedData = {
            ...old,
            data: old.data.filter(
              (item) => item.transactionId !== row.transactionId,
            ),
            total: Math.max(0, old.total - 1),
          };
          return updatedData;
        },
      );

      await showPopup({
        title: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} Payment`,
        body: `Are you sure you want to ${newStatus} this payment?`,
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
              newStatus.toLowerCase() === "approve" ? "primary" : "danger",
            action: async (close: ClosePopup) => {
              try {
                await updateStatusMutation.mutateAsync({
                  body: { transactionId: row.transactionId, action: newStatus },
                });
                refetch();
                close(true);
              } catch {
                toast.error("Failed to process payment. Please try again.");
                queryClient.setQueryData(queryKey, previousData);
                close(false);
              }
            },
          },
        ],
      });
    },
    [
      queryClient,
      showPopup,
      updateStatusMutation,
      page,
      limit,
      refetch,
      selectedRegionId,
    ],
  );

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
              <img
                src={row.engineerProfileUrl}
                alt="profile"
                className="h-6 w-6 rounded-full object-cover"
              />
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
      key: "date&time",
      label: "Requested Date",
      renderCell: (row: TransactionRequest) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.requestedAt || "—"}</span>
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
            {/* {amountNum.toLocaleString("en-IN")} */}
            {formatAmount(amountNum, row.currencySymbol)}
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
            value="pending"
            onChange={(value: string | null) => {
              if (!value || value === "pending") return;

              const lowerValue = value.toLowerCase();
              const normalizedStatus =
                lowerValue === "approve"
                  ? "approve"
                  : lowerValue === "reject"
                    ? "reject"
                    : null;

              if (!normalizedStatus) return;

              handleStatusChange(row, normalizedStatus);
            }}
            options={[
              { label: "Approve", value: "approve" },
              { label: "Reject", value: "reject" },
            ]}
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
            loading={isLoading || updateStatusMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingTable;

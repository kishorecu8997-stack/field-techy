import { transactionRequest } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/Temp";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import type { TransactionRequest } from "../wallet_overview/types";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import { usePopupStore } from "@/shared/store/popupStore";
import type { adminJobsStatus } from "../../jobs/types";

/**
 * PendingTable Component
 *
 * Renders a table of transaction requests with client info, job details, and actions.
 * @returns {JSX.Element} The transaction requests management view.
 */
const PendingTable: React.FC = () => {
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const { showPopup } = usePopupStore();

  const handleStatusChange = async (data: TransactionRequest) => {
    if (!data.status) return;
    const status = data.status;
    await showPopup({
      title: `${status?.charAt(0).toUpperCase() + status?.slice(1)} Job`,
      body: `Are you sure you want to ${
        status?.charAt(0).toUpperCase() + status?.slice(1)
      } this request?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: `${
            status.toLocaleLowerCase() === "approve" ? "primary" : "danger"
          }`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("close :", close);
            // await handlePostAJob(data);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<TransactionRequest>[] = [
    {
      key: "sno",
      label: "Sr.No.",
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
            <div className="font-semibold">{row.details.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.details.phone}
            </div>
          </div>
        </div>
      ),
    },
    { key: "walletBalance", label: "Wallet Balance" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: TransactionRequest) => {
        return (
          <div className="relative w-full">
            <SelectMenu
              placeholder="Select"
              value={rowStatuses[row.sno] || ""}
              onChange={(value: string | null | adminJobsStatus) => {
                setRowStatuses((prev) => ({
                  ...prev,
                  [row.sno]: value ?? "",
                }));
                handleStatusChange({
                  ...row,
                  status: value as adminJobsStatus,
                });
              }}
              options={JobStatus}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <SearchInput />
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<TransactionRequest>
            columns={columns}
            data={transactionRequest}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingTable;

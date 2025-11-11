import { transactionRequest } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import type { TransactionRequest } from "../wallet_overview/types";

/**
 * Engineer Component
 *
 * Renders a table of engineer payment transactions with client info, job details, and actions.
 * @returns {JSX.Element} The engineer management view.
 */
const RejectedTable: React.FC = () => {
  const getRejectedData = () => {
    return transactionRequest.filter((item) => item.status === "rejected");
  };

  const columns: Column<TransactionRequest>[] = [
    {
      key: "sno",
      label: "Sno",
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
      renderCell: (row: TransactionRequest) => row.status.charAt(0).toUpperCase() + row.status.slice(1),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <SearchInput />
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<TransactionRequest>
            columns={columns}
            data={getRejectedData()}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default RejectedTable;

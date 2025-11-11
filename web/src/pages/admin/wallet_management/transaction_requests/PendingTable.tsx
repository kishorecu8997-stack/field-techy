import { options, transactionRequest } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import type { TransactionRequest } from "../wallet_overview/types";

/**
 * PendingTable Component
 * 
 * Renders a table of transaction requests with client info, job details, and actions.
 * @returns {JSX.Element} The transaction requests management view.
 */
const PendingTable: React.FC = () => {
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
      renderCell: (row: TransactionRequest) => (
        <PendingStatus row={row.status} />
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <SearchInput />
        <div className="h-full flex-1 overflow-y-auto ">
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

const PendingStatus = ({ row }: { row: string }) => {
  const [status, setStatus] = useState<string>(row);

  const handleChangeStatus = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="text-sm ">
      <SelectMenu
        placeholder="Select Region"
        className="w-36"
        options={options}
        value={status}
        onChange={() => handleChangeStatus}
      />
    </div>
  );
};

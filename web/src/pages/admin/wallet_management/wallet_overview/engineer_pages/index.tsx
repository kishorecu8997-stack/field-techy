import { engineerData } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { EngineerPage } from "../types";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";

/**
 * Engineer Component
 *
 * Renders a table of engineer payment transactions with client info, job details, and actions.
 * @returns {JSX.Element} The engineer management view.
 */
const EngineerWallet: React.FC = () => {
  const columns: Column<EngineerPage>[] = [
    {
      key: "sno",
      label: "Sno",
    },
    {
      key: "clientDetails",
      label: "Client Details",
      renderCell: (row: EngineerPage) => (
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
      key: "action",
      label: "Action",
      align: "center",
      renderCell: (row: EngineerPage) => (
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 bg-blue-100 rounded-md">
            <CiEdit className="text-blue-600" />
          </div>
          <div className="p-2 bg-red-100 rounded-md">
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <SearchInput />
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<EngineerPage>
            columns={columns}
            data={engineerData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default EngineerWallet;

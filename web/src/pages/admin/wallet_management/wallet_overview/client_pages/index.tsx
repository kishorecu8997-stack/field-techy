import { engineerData } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { EngineerPage } from "../types";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

/**
 * @component ClientWallet
 * @description Renders the client wallet management page.
 * This page displays a table of clients, including their details and wallet balance.
 * It provides actions to navigate to a detailed view of a client's wallet or to delete a client.
 * @returns {JSX.Element} The rendered client wallet management component.
 */
const ClientWallet: React.FC = () => {
  const navigate = useNavigate();

  const columns: Column<EngineerPage>[] = [
    {
      key: "sno",
      label: "Sr.No.",
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
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.wallet_overview_view}/${row.sno}`
              )
            }
          >
            <FiEye className="text-yellow-600 " />
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

export default ClientWallet;

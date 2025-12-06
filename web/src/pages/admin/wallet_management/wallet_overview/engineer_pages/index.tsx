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
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * Engineer Component
 *
 * Renders a table of engineer payment transactions with client info, job details, and actions.
 * @returns {JSX.Element} The engineer management view.
 */
const EngineerWallet: React.FC = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteJob = async (data: EngineerPage) => {
    await showPopup({
      title: "Delete Engineer",
      body: "Are you sure you want to delete this engineer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            close(true);
          },
        },
      ],
    });
  };

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
            <FiEye className="text-yellow-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteJob(row)}
          >
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
        <div className="h-full flex-1 overflow-y-auto">
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

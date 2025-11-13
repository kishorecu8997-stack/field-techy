import { manageClient } from "@/dummy_data/admin/manageClient";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ManageClientProps } from "../types";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";

/**
 * HomeClient Component
 *
 * Renders a management dashboard for home clients, including:
 * - Search functionality
 * - Custom table for displaying client info
 * - Action buttons for viewing, editing, or deleting client records
 *
 * @component
 * @returns {JSX.Element} The rendered HomeClient component.
 */
const HomeClient: React.FC = () => {
  const navigate = useNavigate();
  const columns: Column<ManageClientProps>[] = [
    { key: "id", label: "Sr. NO" },
    {
      key: "clientID",
      label: "Client ID",
      renderCell: (row: ManageClientProps) => {
        const name = row.clientID || "N/A";
        return (
          <span className="flex-nowrap text-nowrap">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        );
      },
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: ManageClientProps) => {
        const name = row.details || "N/A";
        return (
          <span className="flex w-[200px]">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        );
      },
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "registrationDate",
      label: "Registration Date",
    },
    {
      key: "documents",
      label: "View Documents",
      renderCell: (row: ManageClientProps) => {
        const name = row.documents || "N/A";
        return (
          <Button
            className="w-fit "
            onClick={() => alert(`Viewing details for ${row.id}`)}
          >
            {name}
          </Button>
        );
      },
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
    },
    {
      key: "kycStatus",
      label: "KYC Status",
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
    },

    {
      key: "approvalStatus",
      label: "Approval Status",
    },
    {
      key: "action",
      label: "Actions",
      renderCell: (row: ManageClientProps) => (
        <div className="flex items-center gap-2">
          <div
            onClick={() =>
                         navigate(`${absoluteUrls.admin.home.homeClientView}`)
                       }
            className="p-2 bg-yellow-100 rounded-md"
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.homeClientEdit}`)
            }
            className="p-2 bg-blue-100 rounded-md"
          >
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
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md">
      <div className="mb-2 flex justify-between items-center gap-2">
        <SearchInput />
        <Button
          onClick={() => navigate(`${absoluteUrls.admin.home.homeClientAdd}`)}
        >
          Add Client
        </Button>
      </div>
      <div className="h-full flex-1 overflow-y-auto ">
        <CustomTable<ManageClientProps>
          columns={columns}
          data={manageClient}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default HomeClient;

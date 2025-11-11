import { manageClient } from "@/dummy_data/admin/manageClient";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";

export interface ManageClientProps {
  id: number;
  clientID: string;
  details: string;
  documents: string;
  location: string;
  registrationDate: string;
  walletBalance: string;
  kycStatus: string;
  approvalStatus: string;
}


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
        <div className="p-2 bg-yellow-100 rounded-md">
          <FiEye  className="text-yellow-600 "/>
        </div>
        <div className="p-2 bg-blue-100 rounded-md">
          <CiEdit className="text-blue-600"/>
        </div>
        <div className="p-2 bg-red-100 rounded-md">
          <RiDeleteBin6Line className="text-red-600"/>
        </div>
      </div>
    ),
  },
];


/**
 * ManageClient Component
 * 
 * Renders a management dashboard for clients, including:
 * - Search functionality
 * - Custom table for displaying client info
 * - Action buttons for viewing, editing, or deleting client records
 * 
 * @component
 * @returns {JSX.Element} The rendered ManageClient component.
 */
const ManageClient: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Manage Clients</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageClientProps>
            columns={columns}
            data={manageClient}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageClient;

import { manageClient } from "@/dummy_data/admin/manageClient";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ManageClientProps } from "../types";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import Popup from "@/shared/components/Popup";
import ViewFileComponent from "./ViewFileComponent";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * CorporateClient Component
 *
 * Renders a management dashboard for corporate clients, including:
 * - Search functionality
 * - Custom table for displaying client info
 * - Action buttons for viewing, editing, or deleting client records
 *
 * @component
 * @returns {JSX.Element} The rendered CorporateClient component.
 */
const CorporateClient: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteClient = async (client: ManageClientProps) => {
    await showPopup({
      title: "Delete Client",
      body: "Are you sure you want to delete this client?",
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
            console.log("Deleting client:", client.id);
            // TODO: call your delete API here
            // await deleteClient(client.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageClientProps>[] = [
    { key: "id", label: "Sr.No." },
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
            className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            onClick={() => setIsOpen(true)}
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
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.corporateClientView}`)
            }
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.corporateClientEdit}`)
            }
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteClient(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md">
      <div className="mb-2 flex justify-between items-center gap-2">
        <SearchInput />
        <Button
          className="w-fit bg-gradient-to-r bg-teal-900 text-white"
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.corporateClientAdd}`)
          }
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
      <Popup open={isOpen} onClose={() => setIsOpen(false)}>
        <ViewFileComponent onClose={() => setIsOpen(false)} />
      </Popup>
    </div>
  );
};

export default CorporateClient;

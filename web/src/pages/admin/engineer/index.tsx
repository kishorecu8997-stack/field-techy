import { absoluteUrls } from "@/config/urls";
import {
  Employement,
  EngineerStatus,
  JobStatus,
  manageEngineer,
} from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import SelectMenu from "@/shared/components/Selectmenu";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

interface ManageEngineerProps {
  id: number;
  engineerID: string;
  details: string;
  documents: string;
  location: string;
  registrationDate: string;
  walletBalance: string;
  kycStatus: string;
  employementStatus: string;
  avgRating: number;
  approvalStatus: string;
}

/**
 * ManageEngineer Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <ManageEngineer />
 * );
 *
 * @returns {JSX.Element} The rendered ManageEngineer component.
 */
const ManageEngineer: React.FC = () => {
  const navigate = useNavigate();
  const [employementType, setEmployementType] = useState<string | null>();
  const [status, setStatus] = useState<string | null>();
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const columns: Column<ManageEngineerProps>[] = [
    { key: "id", label: "Sr. NO" },
    {
      key: "engineerID",
      label: "Engineer ID",
      renderCell: (row: ManageEngineerProps) => {
        const name = row.engineerID || "N/A";
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
      renderCell: (row: ManageEngineerProps) => {
        const name = row.details || "N/A";
        return (
          <span className="flex w-[200px]">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        );
      },
    },
    {
      key: "documents",
      label: "View Documents",
      align: "center",
      renderCell: (row: ManageEngineerProps) => {
        const name = row.documents || "N/A";
        return (
          <div className="mx-auto text-center">
            <Button
              className="w-fit bg-gradient-to-r bg-teal-900 text-white"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedRowId(row.id);
              }}
            >
              {name}
            </Button>
          </div>
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
      key: "walletBalance",
      label: "Wallet Balance",
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
      key: "employementStatus",
      label: "Employement Status",
    },
    {
      key: "avgRating",
      label: "Avg Rating",
    },
    {
      key: "approvalStatus",
      label: "Approve/Reject",
      renderCell: (row: ManageEngineerProps) => {
        return (
          <div className="relative w-full">
            <SelectMenu
              placeholder="Select"
              value={rowStatuses[row.id] || ""}
              onChange={(value: string | null) => {
                setRowStatuses((prev) => ({
                  ...prev,
                  [row.id]: value ?? "",
                }));
              }}
              options={JobStatus}
            />
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: () => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_engineer_view}`)
            }
          >
            <FiEye className="text-yellow-600" />
          </div>
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_engineer_add}`)
            }
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div className="p-2 bg-red-100 rounded-md cursor-pointer">
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between mt-4">
        <h1 className="text-xl font-semibold ">Manage Engineers</h1>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_engineer_add}`)
            }
          >
            Add Engineer
          </Button>
          <Button variant="solid" className="">
            Export CSV
          </Button>
        </div>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div className="flex gap-4">
          <SearchInput />
          <SelectMenu
            className="absolute z-100"
            placeholder="Filter by"
            value={status}
            onChange={setStatus}
            options={EngineerStatus}
          />
          <SelectMenu
            className="absolute z-100"
            placeholder="Employement Type"
            options={Employement}
            value={employementType}
            onChange={setEmployementType}
          />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={manageEngineer}
            initialPageSize={10}
          />
        </div>
      </div>
      {isModalOpen && (
        <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">View File {selectedRowId}</span>
              <div
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </div>
            </div>
            <div className="border border-gray-400 h-36 my-6">
              <img src="https://via.placeholder.com/500" alt="file" />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ManageEngineer;
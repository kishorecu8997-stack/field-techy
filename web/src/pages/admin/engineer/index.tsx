import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";

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

const columns: Column<ManageEngineerProps>[] = [
  { key: "id", label: "Sr. NO" },
  {
    key: "engineerID",
    label: "Engineer ID",
    renderCell: (row: ManageEngineerProps) => {
      const name = row.engineerID || "N/A";
      return <span className="flex-nowrap text-nowrap">{name.charAt(0).toUpperCase() + name.slice(1)}</span>;
    },
  },
  {
    key: "details",
    label: "Details",
    renderCell: (row: ManageEngineerProps) => {
      const name = row.details || "N/A";
      return <span className="flex w-[200px]">{name.charAt(0).toUpperCase() + name.slice(1)}</span>;
    },
  },
  {
    key: "documents",
    label: "View Documents",
    renderCell: (row: ManageEngineerProps) => {
      const name = row.documents || "N/A";
      return <Button className="w-fit " onClick={() => alert(`Viewing details for ${row.id}`)}>{name}</Button>;
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
    label: "Approval Status",
  },
];

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
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Manage Engineers</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div><SearchInput/></div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={manageEngineer}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageEngineer;

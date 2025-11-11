import { RateCardData } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

export interface RateCardProps {
  id: string;
  skillSet: string;
  region: string;
  location: string;
  rate: string;
  rateType: string;
  project: string;
  createdDate: string;
  status: boolean;
}

/**
 * ManageRateCards Component
 *
 * Displays a searchable and interactive table of rate cards. Allows administrators to:
 * - View rate card details
 * - Toggle status (active/inactive)
 * - Edit or delete specific rate cards
 *
 * @component
 * @example
 * return (
 *   <ManageRateCards />
 * );
 *
 * @returns {JSX.Element} The rendered ManageRateCards component.
 */

const ManageRateCards: React.FC = () => {
  const columns: Column<RateCardProps>[] = [
    { key: "id", label: "Sr. NO" },
    { key: "skillSet", label: "Skill Set" },
    { key: "region", label: "Region" },
    { key: "location", label: "Location" },
    { key: "rate", label: "Rate" },
    { key: "rateType", label: "Rate Type" },
    { key: "project", label: "Project" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: RateCardProps) => {
        const [status, setStatus] = useState<boolean>(row.status);

        return (
          <div
            className={`flex items-center justify-center w-20 px-2 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            onClick={() => setStatus(!status)}
          >
            {status ? "On" : "Off"}
          </div>
        );
      },
    },

    {
      key: "action",
      label: "Actions",
      renderCell: (row: RateCardProps) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-md">
            <FiEye className="text-yellow-600 " />
          </div>
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
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Manage Rate Cards</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<RateCardProps>
            columns={columns}
            data={RateCardData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageRateCards;

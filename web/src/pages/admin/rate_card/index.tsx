import { absoluteUrls } from "@/config/urls";
import { RateCardData } from "@/dummy_data/admin";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { RateCardProps } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";

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
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [status, setStatus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    RateCardData.forEach((rateCard) => {
      initial[rateCard.id] = Boolean(rateCard.status);
    });
    return initial;
  });

  const toggleStatus = (id: string) => {
    setStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //Delete confirmation
  const handleDeleteJob = async (job: RateCardProps) => {
    await showPopup({
      title: "Rate Card",
      body: "Are you sure you want to delete this rate card?",
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
            console.log("Deleting job:", job.id);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<RateCardProps>[] = [
    {
      key: "id",
      label: "SR. NO",
      renderCell: (row: RateCardProps) => (
        <div className="whitespace-nowrap">{row.id}</div>
      ),
    },
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
        const val = status[row.id] ?? row.status;

        return (
          <div
            className={`flex items-center justify-center w-20 px-2 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            onClick={() => toggleStatus(row.id)}
          >
            {val ? "On" : "Off"}
          </div>
        );
      },
    },

    {
      key: "action",
      label: "Actions",
      renderCell: (row: RateCardProps) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() => navigate(absoluteUrls.admin.home.view_rate_card)}
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() => navigate(absoluteUrls.admin.home.edit_rate_card)}
          >
            <CiEdit className="text-blue-600" />
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
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="font-semibold ">Manage Rate Cards</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div className="flex justify-between">
          <SearchInput />
          <Button
            className="whitespace-nowrap bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-600"
            onClick={() => navigate(absoluteUrls.admin.home.add_rate_card)}
          >
            Add New Rate Card
          </Button>
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

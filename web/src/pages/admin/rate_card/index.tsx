import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState, useMemo } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { RateCardProps } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";
import useToggleStatus from "@/shared/components/ToggleStatus";
import { useGetRateCards, useDeleteRateCard } from "@/shared/apiServices/admin/adminService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch rate cards from API
  const { data: rateCardsResponse, isLoading, isError, refetch } = useGetRateCards({
    page: 1,
    limit: 100,
  });

  const deleteRateCardMutation = useDeleteRateCard({
    onSuccess: () => {
      toast.success("Rate card deleted successfully!");
      refetch();
    },
    onError: (error: unknown) => {
      console.error("Failed to delete rate card:", error);
      toast.error("Failed to delete rate card. Please try again.");
    },
  });

  // Transform API data to match table format
  const tableData: RateCardProps[] = useMemo(() => {
    if (!rateCardsResponse?.data) return [];
    
    return rateCardsResponse.data.map((item) => ({
      id: String(item.id),
      skillSet: item.serviceCategory || "-",
      region: item.region || "-",
      location: item.country || "-",
      experienceLevel: item.experienceLevels?.join(", ") || "-",
      hourly: item.hourly || "-",
      halfDay: item.halfDay || "-",
      fullDay: item.fullDay || "-",
      weekly: item.weekly || "-",
      monthly: item.monthly || "-",
      project: "-",
      createdDate: item.createdDate ? new Date(item.createdDate).toLocaleDateString() : "-",
      status: true, // Default status
      experienceLevels: item.experienceLevels,
      country: item.country,
      serviceCategoryId: item.serviceCategoryId,
      countryId: item.countryId,
    }));
  }, [rateCardsResponse]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    const search = searchTerm.toLowerCase();
    return tableData.filter(
      (item) =>
        item.skillSet.toLowerCase().includes(search) ||
        item.region.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search) ||
        item.experienceLevel.toLowerCase().includes(search) ||
        item.hourly.toLowerCase().includes(search) ||
        item.halfDay.toLowerCase().includes(search) ||
        item.fullDay.toLowerCase().includes(search) ||
        item.weekly.toLowerCase().includes(search) ||
        item.monthly.toLowerCase().includes(search)
    );
  }, [tableData, searchTerm]);

  const initialStatus = React.useMemo(() => {
    const initial: Record<string, boolean> = {};
    tableData.forEach((rateCard) => {
      initial[rateCard.id] = rateCard.status;
    });
    return initial;
  }, [tableData]);
  const { get, toggle } = useToggleStatus(initialStatus);

  //Delete confirmation
  const handleDeleteJob = async (job: RateCardProps) => {
    const rateCardId = parseInt(job.id, 10);
    
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
            deleteRateCardMutation.mutate(rateCardId);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<RateCardProps>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (_row: RateCardProps, index: number) => (
        <div className="whitespace-nowrap">{index + 1}</div>
      ),
    },
    { key: "skillSet", label: "Service category",
      renderCell: (row: RateCardProps) => (
        <div className="whitespace-nowrap">{row.skillSet}</div>
      ),
    },
    { key: "region", label: "Region",
      renderCell: (row: RateCardProps) => (
        <div className="whitespace-nowrap">{row.region}</div>
      ),
    },
    { key: "location", label: "Country",
      renderCell: (row: RateCardProps) => (
        <div className="whitespace-nowrap">{row.location}</div>
      ),
    },
    {
      key: "experienceLevel",
      label: "Experience Level",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          {row.experienceLevels && row.experienceLevels.length > 0 ? (
            row.experienceLevels.map((level, idx) => (
              <div key={idx} className="text-sm">{level}</div>
            ))
          ) : (
            <>
              <div className="text-sm">Level 1 - Junior (1-3 years)</div>
              <div className="text-sm">Level 2 - Mid (3-5 years)</div>
              <div className="text-sm">Level 3 - Senior (5+ years)</div>
            </>
          )}
        </div>
      ),
    },
    { key: "hourly", label: "Hourly",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.hourly !== "-" ? row.hourly : "-"}</div>
        </div>
      ),
    },
    { key: "halfDay", label: "Half-Day (4h)",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.halfDay !== "-" ? row.halfDay : "-"}</div>
        </div>
      ),
    },
    { key: "fullDay", label: "Full-Day (8h)",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.fullDay !== "-" ? row.fullDay : "-"}</div>
        </div>
      ),
    },
    { key: "weekly", label: "Weekly (5d)",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.weekly !== "-" ? row.weekly : "-"}</div>
        </div>
      ),
    },
    { key: "monthly", label: "Monthly",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.monthly !== "-" ? row.monthly : "-"}</div>
        </div>
      ),
    },
    { key: "createdDate", label: "Created Date" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: RateCardProps) => {
        const val = get(row.id) ?? row.status;

        return (
          <div
            className={`flex items-center justify-center w-fit px-4 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            onClick={() => toggle(row.id)}
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
            onClick={() => navigate(absoluteUrls.admin.home.edit_rate_card.replace(":id", String(row.id)))}
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
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="font-semibold ">Manage Rate Cards</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex justify-between">
          <SearchInput
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
          <Button
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
            onClick={() => navigate(absoluteUrls.admin.home.add_rate_card)}
          >
            Add New Rate Card
          </Button>
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoaderComponent />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-red-500">Failed to load rate cards</p>
              <Button onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-gray-500">No rate cards found</p>
            </div>
          ) : (
            <CustomTable<RateCardProps>
              columns={columns}
              data={filteredData}
              initialPageSize={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRateCards;

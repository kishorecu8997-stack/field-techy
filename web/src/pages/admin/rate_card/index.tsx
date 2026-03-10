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
import { useGetRateCards } from "@/shared/apiServices/admin/adminService";
// import { useAdminDeleteRateCard } from "@/shared/apiServices/admin/adminOpenApiService";
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

  // const deleteRateCardMutation = useAdminDeleteRateCard({
  //   onSuccess: () => {
  //     toast.success("Rate card deleted successfully!");
  //     refetch();
  //   },
  //   onError: (error: unknown) => {
  //     console.error("Failed to delete rate card:", error);
  //     toast.error("Failed to delete rate card. Please try again.");
  //   },
  // });

  // Transform API data to match table format with grouped experience levels
  const tableData: RateCardProps[] = useMemo(() => {
    if (!rateCardsResponse?.data) return [];
    
    // Group by serviceCategoryId
    const groupedData = new Map<number, RateCardProps>();
    
    rateCardsResponse.data.forEach((item) => {
      const key = item.serviceCategoryId;
      
      if (!groupedData.has(key)) {
        // First entry for this service category - create base row
        groupedData.set(key, {
          id: String(item.id),
          skillSet: item.serviceCategory || "-",
          region: item.region || "-",
          location: item.country || "-",
          experienceLevel: item.experienceLevels?.join(", ") || "-",
          hourly: "-",
          fullDay: "-",
          monthly: "-",
          project: "-",
          createdDate: item.createdDate || "-",
          status: true,
          experienceLevels: ["L1", "L2", "L3"], // All three levels
          country: item.country,
          serviceCategoryId: item.serviceCategoryId,
          countryId: item.countryId,
          // Store individual rates per level
          experienceLevelRates: {
            L1: { hourly: "-", daily: "-", monthly: "-" },
            L2: { hourly: "-", daily: "-", monthly: "-" },
            L3: { hourly: "-", daily: "-", monthly: "-" },
          },
        });
      }
      
      // Get the existing row and update with this level's rates
      const existingRow = groupedData.get(key)!;
      const level = item.experienceLevels?.[0] as "L1" | "L2" | "L3";
      
      if (level && existingRow.experienceLevelRates) {
        // Parse the rates array from the new API response
        const ratesMap: Record<string, string> = {};
        if (item.rates && Array.isArray(item.rates)) {
          item.rates.forEach((rate: { modelName: string; rate: string }) => {
            // Map modelName to our internal format
            if (rate.modelName === "Hourly") ratesMap.hourly = rate.rate || "-";
            else if (rate.modelName === "Daily") ratesMap.daily = rate.rate || "-";
            else if (rate.modelName === "Monthly") ratesMap.monthly = rate.rate || "-";
          });
        }
        
        existingRow.experienceLevelRates[level] = {
          hourly: ratesMap.hourly || "-",
          daily: ratesMap.daily || "-",
          monthly: ratesMap.monthly || "-",
        };
      }
    });
    
    return Array.from(groupedData.values());
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
        item.fullDay.toLowerCase().includes(search) ||
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
    const rateCardServiceCategoryId = job.serviceCategoryId;
    
    if (rateCardServiceCategoryId === undefined) {
      toast.error("Unable to delete: Service category ID not found.");
      return;
    }
    
    await showPopup({
      title: "Rate Card",
      body: "Are you sure you want to delete this rate card?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        // {
        //   label: "Delete",
        //   value: "delete",
        //   variant: "danger",
        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   action: async (close: any) => {
        //     deleteRateCardMutation.mutate({ query: { serviceCategoryId: rateCardServiceCategoryId } });
        //     close(true);
        //   },
        // },
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
      renderCell: (_row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">L1 - Junior (1-3 yrs)</div>
          <div className="text-sm font-medium">L2 - Mid (3-5 yrs)</div>
          <div className="text-sm font-medium">L3 - Senior (5+ yrs)</div>
        </div>
      ),
    },
    { key: "hourly", label: "Hourly",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.experienceLevelRates?.L1.hourly || "-"}</div>
          <div className="text-sm">{row.experienceLevelRates?.L2.hourly || "-"}</div>
          <div className="text-sm">{row.experienceLevelRates?.L3.hourly || "-"}</div>
        </div>
      ),
    },
    { key: "fullDay", label: "Daily",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.experienceLevelRates?.L1.daily || "-"}</div>
          <div className="text-sm">{row.experienceLevelRates?.L2.daily || "-"}</div>
          <div className="text-sm">{row.experienceLevelRates?.L3.daily || "-"}</div>
        </div>
      ),
    },
    { key: "monthly", label: "Monthly",
      renderCell: (row: RateCardProps) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm">{row.experienceLevelRates?.L1.monthly || "-"}</div>
          <div className="text-sm">{row.experienceLevelRates?.L2.monthly || "-"}</div>
          <div className="text-sm">{row.experienceLevelRates?.L3.monthly || "-"}</div>
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
            onClick={() => navigate(absoluteUrls.admin.home.view_rate_card.replace(":id", String(row.serviceCategoryId)))}
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() => navigate(absoluteUrls.admin.home.edit_rate_card.replace(":id", String(row.serviceCategoryId)))}
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

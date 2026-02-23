import { useState } from "react";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import type { JobItem } from "@/pages/admin/jobs/types";
import GeneralChart from "@/shared/components/AdminChart";
import SelectMenu from "@/shared/components/SelectMenu";
import { days } from "@/dummy_data/adminDashboard";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import { chartData } from "@/dummy_data/chart";

interface ClientJobByCategoryProps {
  data: JobItem[];
  isLoading?: boolean;
  error?: unknown;
  search: string;
  setSearch: (value: string) => void;
  onClearFilters: () => void;
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * Renders the job history table for a specific client.
 * Pattern follows the JobByCategory component used in Manage Jobs.
 */
const ClientJobByCategory: React.FC<ClientJobByCategoryProps> = ({
  data,
  isLoading,
  error,
  search,
  setSearch,
  onClearFilters,
  page = 1,
  limit = 10,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const navigate = useNavigate();

  const columns: Column<JobItem>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: JobItem, index: number) =>
        (page - 1) * limit + index + 1,
    },
    { key: "jobCode", label: "Job ID" },
    { key: "jobTitle", label: "Job Title" },
    {
      key: "jobDescription",
      label: "Job Description",
      renderCell: (row: JobItem) => (
        <p className="text-sm max-w-xs truncate" title={row.jobDescription ?? ""}>
          {row.jobDescription || "N/A"}
        </p>
      ),
    },
    { key: "categoryName", label: "Category" },
    { key: "jobType", label: "Job Type" },
    {
      key: "totalPrice",
      label: "Job Price",
      renderCell: (row: JobItem) =>
        row.totalPrice ? `₹${row.totalPrice}` : "N/A",
    },
    { key: "countryName", label: "Country" },
    { key: "stateName", label: "State" },
    { key: "cityName", label: "City" },
    {
      key: "startDate",
      label: "Start Date/Time",
      renderCell: (row: JobItem) =>
        row.startDate ? dayjs(row.startDate).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      key: "createdAt",
      label: "Created Date",
      renderCell: (row: JobItem) =>
        row.createdAt ? dayjs(row.createdAt).format("DD/MM/YYYY") : "N/A",
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row: JobItem) => {
        return <span className="capitalize">{row.status || "N/A"}</span>;
      },
    },
    {
      key: "action",
      label: "Action",
      renderCell: () => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() => navigate(absoluteUrls.admin.home.manage_jobs_view)}
          >
            <FiEye className="text-yellow-600" />
          </div>
        </div>
      ),
    },
  ];

  const [selectedDay, setSelectedDay] = useState<string | null>();
  const hasSelectedFilters = Boolean(search);

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex flex-wrap gap-4 items-center">
        <SearchInput value={search} onChange={setSearch} />
        {hasSelectedFilters && (
          <Button variant="danger" onClick={onClearFilters}>
            Cancel Filters
          </Button>
        )}
      </div>
      <div className="h-full flex-1 overflow-y-auto mt-4">
        <CustomTable<JobItem>
          columns={columns}
          data={data}
          initialPageSize={limit}
          loading={isLoading}
          error={error ? "An error occurred while fetching jobs." : null}
          totalCount={total}
          currentPage={page}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Total Jobs Completed
              </h3>
              <SelectMenu
                placeholder="Select Filter"
                className="w-32"
                options={days}
                value={selectedDay}
                onChange={setSelectedDay}
              />
            </div>

            <GeneralChart
              data={chartData}
              chartType="line"
              xAxisDataKey="name"
              aspectRatio={2}
              series={[
                {
                  dataKey: "jobs",
                  name: "Jobs",
                  fill: "#0f766e",
                },
              ]}
              customTooltip={CustomTooltip}
              height={400}
              showLegend={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientJobByCategory;

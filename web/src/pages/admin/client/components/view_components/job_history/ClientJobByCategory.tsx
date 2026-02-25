import { useMemo, useState } from "react";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { absoluteUrls } from "@/config/urls";
import type { JobItem } from "@/pages/admin/jobs/types";
import GeneralChart from "@/shared/components/AdminChart";
import SelectMenu from "@/shared/components/SelectMenu";
import { days } from "@/dummy_data/adminDashboard";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import { useAdminGetJobGraph } from "@/shared/apiServices/admin/adminOpenApiService";
import { useSearchParams } from "react-router-dom";

interface ClientJobByCategoryProps {
  data: JobItem[];
  isLoading?: boolean;
  error?: unknown;
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  userId?: number;
  search?: string;
  setSearch?: (value: string) => void;
}

/**
 * Renders the job history table for a specific client.
 * Pattern follows the JobByCategory component used in Manage Jobs.
 */
const ClientJobByCategory: React.FC<ClientJobByCategoryProps> = ({
  data,
  isLoading,
  error,
  page = 1,
  limit = 10,
  total,
  onPageChange,
  onPageSizeChange,
  userId,
  search: externalSearch,
  setSearch: externalSetSearch,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const internalSearch = searchParams.get("search") || "";

  const search = externalSearch !== undefined ? externalSearch : internalSearch;

  const setSearch = (value: string) => {
    if (externalSetSearch) {
      externalSetSearch(value);
    } else {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams, { replace: true });
    }
  };


  const filteredData = useMemo(() => {
    // If we have external search, the data is already filtered by the parent
    if (externalSearch !== undefined || !search) return data;

    const query = search.toLowerCase();
    return data.filter(
      (item) =>
        item.jobTitle?.toLowerCase().includes(query) ||
        item.jobCode?.toLowerCase().includes(query) ||
        item.jobDescription?.toLowerCase().includes(query) ||
        item.categoryName?.toLowerCase().includes(query),
    );
  }, [data, search, externalSearch]);

  const [selectedDay, setSelectedDay] = useState<string | null>("monthly");

  const intervalMap: Record<string, "day" | "week" | "month" | "year"> = {
    daily: "day",
    weekly: "week",
    monthly: "month",
    yearly: "year",
  };

  const {
    data: graphResponse,
    isLoading: isGraphLoading,
    error: graphError,
  } = useAdminGetJobGraph(
    {
      userId,
      interval: intervalMap[selectedDay || "monthly"],
    },
    {
      enabled: !!userId,
    },
  );

  const chartData = useMemo(() => {
    if (graphResponse?.data) {
      return graphResponse.data.map((item) => ({
        name: dayjs(item.label).format("DD/MM/YYYY"),
        jobs: item.completed || 0,
      }));
    }
    return [];
  }, [graphResponse]);

  const columns: Column<JobItem>[] = useMemo(
    () => [
      {
        label: "Sr.No.",
        renderCell: (_row: JobItem, index: number) =>
          (page - 1) * limit + index + 1,
      },
      { key: "jobCode", label: "Job ID" },
      {key: "postedBy", label: "Posted By", renderCell: (row: JobItem) => row.postedBy?.name},
      { key: "jobTitle", label: "Job Title" },
      {
        key: "jobDescription",
        label: "Job Description",
        renderCell: (row: JobItem) => (
          <p
            className="text-sm max-w-xs truncate"
            title={row.jobDescription ?? ""}
          >
            {row.jobDescription || "N/A"}
          </p>
        ),
      },
      { key: "jobType", label: "Job Type" },
      { key: "countryName", label: "Country" },
      { key: "stateName", label: "State" },
      { key: "cityName", label: "City" },
      {
        key: "startDate",
        label: "Start Date/Time",
        renderCell: (row: JobItem) =>
          row.startDate
            ? dayjs(row.startDate).format("DD/MM/YYYY HH:mm")
            : "N/A",
      },
      {
        key: "createdAt",
        label: "Created Date",
        renderCell: (row: JobItem) =>
          row.createdAt ? dayjs(row.createdAt).format("DD/MM/YYYY") : "N/A",
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
    ],
    [page, limit, navigate],
  );

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex flex-wrap gap-4 items-center">
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <div className="h-full flex-1 overflow-y-auto mt-4">
        <CustomTable<JobItem>
          columns={columns}
          data={filteredData}
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
              isLoading={isGraphLoading}
              error={
                graphError
                  ? "An error occurred while fetching graph data."
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientJobByCategory;

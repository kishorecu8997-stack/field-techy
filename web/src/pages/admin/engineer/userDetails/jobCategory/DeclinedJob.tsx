import { chartData, days } from "@/dummy_data/admin/manageEngineer";
import GeneralChart from "@/shared/components/AdminChart";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import { useAdminGetEngineerHistory } from "@/shared/apiServices/admin/adminOpenApiService";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { EngineerAssignment } from "./types";

/**
 * DeclinedJob Component
 *
 * Shows jobs an engineer declined.
 * Searchable table + analytics chart.
 */
const DeclinedJob: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = useParams();
  const userId = Number(params.id);
  const hasValidUserId = Number.isFinite(userId) && userId > 0;

  const {
    data: engineerHistory,
    isLoading,
    error,
  } = useAdminGetEngineerHistory(
    hasValidUserId ? userId : 0,
    {
      page,
      limit,
      type: "jobs",
      statusGroup: "declined",
    },
    { enabled: hasValidUserId },
  );

  const jobs: EngineerAssignment[] = useMemo(
    () => (engineerHistory?.data ?? []) as EngineerAssignment[],
    [engineerHistory?.data],
  );

  const filteredJobs = useMemo(() => {
    if (!search) return jobs;
    const query = search.toLowerCase();
    return jobs.filter((job) => {
      return (
        String(job.jobId).includes(query) ||
        (job.engineer?.name ?? "").toLowerCase().includes(query) ||
        (job.engineer?.email ?? "").toLowerCase().includes(query)
      );
    });
  }, [jobs, search]);

  const columns: Column<EngineerAssignment>[] = [
    {
      key: "assignmentId",
      label: "Assignment ID",
      renderCell: (row) => <span>{row.assignmentId}</span>,
    },
    {
      key: "jobId",
      label: "Job ID",
      renderCell: (row) => <span>{row.jobId}</span>,
    },
    {
      key: "engineer",
      label: "Engineer",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {row.engineer?.name?.charAt(0)?.toUpperCase() ?? "N"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">
              {row.engineer?.name ?? "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {row.engineer?.email ?? "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "assignmentType",
      label: "Type",
      renderCell: (row) => <span>{row.assignmentType}</span>,
    },
    {
      key: "proposalDetail",
      label: "Proposal",
      renderCell: (row) => (
        <p className="text-sm max-w-xs truncate">
          {row.proposalDetail || "N/A"}
        </p>
      ),
    },
    {
      key: "location",
      label: "Location",
      renderCell: (row) => (
        <span>
          {row.engineer?.city ?? "N/A"}, {row.engineer?.state ?? "N/A"}
        </span>
      ),
    },
    {
      key: "appliedAt",
      label: "Applied Date",
      renderCell: (row) => (
        <span>
          {row.appliedAt ? new Date(row.appliedAt).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      key: "jobStatus",
      label: "Job Status",
      renderCell: (row) => (
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.jobStatus === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {row.jobStatus}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <SearchInput value={search} onChange={setSearch} />

      <div className="h-full flex-1 overflow-y-auto my-4">
        <CustomTable<EngineerAssignment>
          columns={columns}
          data={filteredJobs}
          initialPageSize={limit}
          loading={isLoading}
          error={
            !hasValidUserId
              ? "Missing engineer id in the URL."
              : error
                ? "An error occurred while fetching declined jobs."
                : null
          }
          totalCount={engineerHistory?.total ?? 0}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      </div>

      <div className="w-1/2">
        <div className="flex justify-between items-center mt-2 md:mb-2 gap-4">
          <p className="font-bold">Total Jobs Declined</p>
          <SelectMenu
            placeholder="Filter By"
            className="md:w-32"
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
          series={[{ dataKey: "jobs", name: "Jobs", fill: "#e5e5e5" }]}
          customTooltip={CustomTooltip}
          height={400}
          showLegend
          legend={{
            verticalAlign: "top",
            align: "center",
            wrapperStyle: { paddingTop: "5px", paddingBottom: "5px" },
          }}
        />
      </div>
    </div>
  );
};

export default DeclinedJob;

import AdminTabComponent from "@/shared/components/AdminTabComponent";
import Users from "./Users";
import GeneralChart from "@/shared/components/AdminChart";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import SelectMenu from "@/shared/components/SelectMenu";
import { useMemo, useState } from "react";
import JobsMetrics from "./JobMetrics";
import FinancialSummary from "./FinacialSummary";
import DisputeManagement from "./DisputeManagement";
import {
  useAdminGetDashboardJobGraph,
  useAdminGetUserGraph,
  useAdminGetDashboardStats,
} from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import {
  client,
  days,
  intervalMap,
  roleMap,
  status,
  statusMap,
  type IntervalType,
  type RoleType,
  type StatusType,
} from "./types";

/**
 * Dashboard page for admin.
 *
 * Presents several dashboard tabs (Users, Job Metrics, Financial Summary,
 * Dispute Management Overview) and below the tabbed section renders two
 * charts for total users and total jobs with filter controls.
 *
 * @component
 * @returns {JSX.Element} Admin dashboard with metrics and charts.
 */
export default function Dashboard() {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useAdminGetDashboardStats();

  const tabs = [
    {
      label: "Users",
      content: (
        <Users
          engineerData={statsData?.engineer}
          clientData={statsData?.client}
          isLoading={isStatsLoading}
          isError={isStatsError}
        />
      ),
      hide: false,
    },
    {
      label: "Job Metrics",
      content: (
        <JobsMetrics
          jobsData={statsData?.jobs}
          isLoading={isStatsLoading}
          isError={isStatsError}
        />
      ),
      hide: false,
    },
    {
      label: "Financial Summary",
      content: (
        <FinancialSummary
          financeData={statsData?.finance}
          isLoading={isStatsLoading}
          isError={isStatsError}
        />
      ),
      hide: false,
    },
    {
      label: "Dispute Management Overview",
      content: (
        <DisputeManagement
          disputeData={statsData?.disputes}
          isLoading={isStatsLoading}
          isError={isStatsError}
        />
      ),
      hide: false,
    },
  ];

  const [selected, setSelected] = useState<RoleType | null>(null);
  const [selectedDay, setSelectedDay] = useState<IntervalType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
  const [jobsSelectedDays, setJobsSelectedDays] = useState<IntervalType | null>(
    null,
  );

  const {
    data: jobGraphData,
    isLoading: isJobGraphLoading,
    isError: isJobGraphError,
  } = useAdminGetDashboardJobGraph({
    interval: jobsSelectedDays ? intervalMap[jobsSelectedDays] : "month",
    status: selectedStatus ? statusMap[selectedStatus] : undefined,
  });

  const {
    data: userGraphData,
    isLoading: isUserGraphLoading,
    isError: isUserGraphError,
  } = useAdminGetUserGraph({
    interval: selectedDay ? intervalMap[selectedDay] : "month",
    role: selected ? roleMap[selected] : undefined,
  });

  const formattedJobData = useMemo(() => {
    if (!jobGraphData?.data) return [];
    return jobGraphData.data.map((item) => ({
      name: item.label,
      jobs: item.count,
    }));
  }, [jobGraphData]);

  const formattedUserData = useMemo(() => {
    if (!userGraphData?.data) return [];
    return userGraphData.data.map((item) => ({
      name: item.label,
      users: item.count,
    }));
  }, [userGraphData]);

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Manage Dashboard</p>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Users" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        <div className=" bg-white dark:bg-gray-700 rounded-lg p-2 ">
          <div className="grid">
            <div className="grid md:flex justify-between p-4">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <div className="grid mt-2 md:md-0 md:flex gap-4">
                <SelectMenu
                  placeholder="Filter By"
                  className="md:w-28"
                  options={days}
                  value={selectedDay}
                  onChange={(val) => setSelectedDay(val as IntervalType)}
                />
                <SelectMenu
                  placeholder="Select Role"
                  className="w-36"
                  options={client}
                  value={selected}
                  onChange={(val) => setSelected(val as RoleType)}
                />
              </div>
            </div>
            {isUserGraphLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <LoaderComponent />
              </div>
            ) : isUserGraphError ? (
              <div className="h-[400px] flex items-center justify-center text-red-600 font-medium">
                Failed to load user graph data
              </div>
            ) : formattedUserData.length > 0 ? (
              <GeneralChart
                data={formattedUserData}
                chartType="line"
                xAxisDataKey="name"
                yAxisDomain={[0, "auto"]}
                aspectRatio={2}
                cursor={{ fill: "#fff", fillOpacity: 0.05 }}
                series={[
                  {
                    dataKey: "users",
                    name: "Users",
                    fill: "#6b7280",
                  },
                ]}
                customTooltip={CustomTooltip}
                height={400}
                showLegend={false}
                legend={{
                  verticalAlign: "top",
                  align: "center",
                  wrapperStyle: { paddingTop: "5px", paddingBottom: "5px" },
                }}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500 font-medium">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-2 ">
          <div className="grid md:flex justify-between p-4">
            <h3 className="text-lg font-semibold">Total Jobs</h3>
            <div className="grid mt-4 md:mt-0 md:flex gap-4">
              <SelectMenu
                placeholder="Filter By"
                className="w-28"
                options={days}
                value={jobsSelectedDays}
                onChange={(val) => setJobsSelectedDays(val as IntervalType)}
              />
              <SelectMenu
                placeholder="Select Status"
                className="w-36"
                options={status}
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val as StatusType)}
              />
            </div>
          </div>
          {isJobGraphLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <LoaderComponent />
            </div>
          ) : isJobGraphError ? (
            <div className="h-[400px] flex items-center justify-center text-red-600 font-medium">
              Failed to load job graph data
            </div>
          ) : formattedJobData.length > 0 ? (
            <GeneralChart
              data={formattedJobData}
              chartType="bar"
              xAxisDataKey="name"
              yAxisDomain={[0, "auto"]}
              aspectRatio={2}
              cursor={{ fill: "#fff", fillOpacity: 0.05 }}
              series={[
                {
                  dataKey: "jobs",
                  name: "Jobs",
                  fill: "#e5e5e5",
                },
              ]}
              customTooltip={CustomTooltip}
              height={400}
              showLegend={false}
              legend={{
                verticalAlign: "top",
                align: "center",
                wrapperStyle: { paddingTop: "5px", paddingBottom: "5px" },
              }}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500 font-medium">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import AdminTabComponent from "@/shared/components/AdminTabComponent";
import Users from "./Users";
import GeneralChart from "@/shared/components/AdminChart";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import { chartData } from "@/dummy_data/chart";
import SimpleSelect from "@/shared/components/SelectMenu";
import { useState } from "react";
import { days, client, status } from "@/dummy_data/adminDashboard";
import JobsMetrics from "./JobMetrics";
import FinancialSummary from "./FinacialSummary";
import DisputeManagement from "./DisputeManagement";

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
  const tabs = [
    {
      label: "Users",
      content: <Users />,
      hide: false,
    },
    {
      label: "Job Metrics",
      content: <JobsMetrics />,
      hide: false,
    },
    {
      label: "Financial Summary",
      content: <FinancialSummary />,
      hide: false,
    },
    {
      label: "Dispute Management Overview",
      content: <DisputeManagement />,
      hide: false,
    },
  ];

  const [selected, setSelected] = useState<string | null>();
  const [selectedDay, setSelectedDay] = useState<string | null>();
  const [selectedStatus, setSelectedStatus] = useState<string | null>();
  const [jobsSelectedDays, setJobsSelectedDays] = useState<string | null>();

  // ===== Compute chart data based on selected client =====
  // const filteredChartData = useMemo(() => {
  //   return chartData[selected] || [];
  // }, [selected]);

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
                <SimpleSelect
                  placeholder="Filter By"
                  className="md:w-32"
                  options={days}
                  value={selectedDay}
                  onChange={setSelectedDay}
                />
                <SimpleSelect
                  placeholder="Select Filter"
                  className="w-42"
                  options={client}
                  value={selected}
                  onChange={setSelected}
                />
              </div>
            </div>
            <GeneralChart
              data={chartData}
              chartType="line"
              xAxisDataKey="name"
              aspectRatio={2}
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
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-2 ">
          <div className="grid md:flex justify-between p-4">
            <h3 className="text-lg font-semibold">Total Jobs</h3>
            <div className="grid mt-4 md:mt-0 md:flex gap-4">
              <SimpleSelect
                placeholder="Filter By"
                className="w-32"
                options={status}
                value={selectedStatus}
                onChange={setSelectedStatus}
              />
              <SimpleSelect
                placeholder="Select Filter"
                className="w-42"
                options={days}
                value={jobsSelectedDays}
                onChange={setJobsSelectedDays}
              />
            </div>
          </div>
          <GeneralChart
            data={chartData}
            chartType="bar"
            xAxisDataKey="name"
            aspectRatio={2}
            series={[
              {
                dataKey: "jobs",
                name: "Jobs",
                fill: "#e5e5e5",
              },
            ]}
            customTooltip={CustomTooltip}
            height={400}
            showLegend={true}
            legend={{
              verticalAlign: "top",
              align: "center",
              wrapperStyle: { paddingTop: "5px", paddingBottom: "5px" },
            }}
          />
        </div>
      </div>
    </div>
  );
}

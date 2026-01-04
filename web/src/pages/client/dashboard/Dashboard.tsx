import { absoluteUrls } from "@/config/urls";
import { jobOverviewData, serviceCategoriesData } from "@/dummy_data/dashboard";
import { earningsData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import { transactions } from "@/dummy_data/bankDetails";
import { getMonthlyEarnings } from "@/shared/libs/utils";
import type { MonthlyData } from "@/shared/libs/utils";
import React, { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import SidebarJobPostWallet from "../../../shared/components/SidebarJobPostWallet";
import AllowAccessPopup from "@/shared/components/commonUI/AllowAccessPopup";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useFCM } from "@/shared/hooks/useFCM";
import InProgressJobCard from "./components/InProgressJobCard";
import JobOverviewCard from "./components/JobOverview";
import ServiceCategoryCard from "./components/ServiceCategoryCard";
import type { Job } from "../search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * `Dashboard` component serves as the main dashboard for the client user.
 * It displays an overview of jobs, service categories, and in-progress jobs.
 * It also includes a sidebar with wallet and job posting information.
 */
const Dashboard: React.FC = () => {
  const [accessPopup, setAccessPopup] = React.useState<boolean>(false);
  const { locationPermission, notificationPermission } = useDeviceStore();
  const { checkPermission: checkLocationPermission } = useGeolocation();
  const { checkPermission: checkNotificationPermission } = useFCM();

  const inProgressJobsData = useMemo(
    () => sampleJobs.filter((job) => job.status === "inprogress"),
    []
  );

  const monthlyEarningsData: MonthlyData[] = useMemo(() => {
    const formatted = transactions.map((tx) => ({
      date:
        typeof tx.date === "string"
          ? tx.date
          : (tx.date as Date).toISOString().split("T")[0],
      amount: tx.amount,
    }));
    return getMonthlyEarnings(formatted);
  }, []);

  const totalEarnings = useMemo(
    () => monthlyEarningsData.reduce((sum, item) => sum + item.earnings, 0),
    [monthlyEarningsData]
  );
  // Check actual browser permission states on mount and sync with store
  useEffect(() => {
    checkLocationPermission();
    checkNotificationPermission();
  }, [checkLocationPermission, checkNotificationPermission]);

  useEffect(() => {
    // Show popup if either permission is in 'prompt' state (or not granted/denied explicitly yet)
    // We can also check for 'denied' if we want to re-prompt, but usually we respect 'denied' until user resets.
    // Here we check if it's 'prompt' or 'default'.
    if (
      locationPermission === "prompt" ||
      notificationPermission === "default"
    ) {
      setAccessPopup(true);
    }
  }, [locationPermission, notificationPermission]);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Job Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {jobOverviewData.map((job) => (
                <JobOverviewCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  count={job.count}
                  status={job.status}
                  buttonShow={job.buttonShow}
                />
              ))}
            </div>

            {/* Monthly Earnings Chart */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Monthly Earnings</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                      ${totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total earnings
                    </p>
                  </div>
                  {monthlyEarningsData.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Up to{" "}
                      {
                        monthlyEarningsData[monthlyEarningsData.length - 1]
                          .month
                      }
                    </p>
                  )}
                </div>

                {monthlyEarningsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        stroke="#888"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#888"
                        tickFormatter={(value: number) =>
                          value >= 1000
                            ? `$${(value / 1000).toFixed(0)}k`
                            : `$${value}`
                        }
                      />
                      {/* FIXED TOOLTIP */}
                      <Tooltip
                        formatter={(value: any) => {
                          if (typeof value === "number") {
                            return `$${value.toLocaleString()}`;
                          }
                          return "$0";
                        }}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No earnings data available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Rest of your dashboard sections (unchanged) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Service Categories</h2>
                <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <NavLink
                    to={absoluteUrls.client.home.client_Explore_engineers}
                    className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
                  >
                    <Button
                      variant="link"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer"
                    >
                      View all
                    </Button>
                  </NavLink>
                </nav>
              </div>

              <NavLink
                to={absoluteUrls.client.home.client_Explore_engineers}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 cursor-pointer hover:text-teal-800 text-[1rem] whitespace-nowrap"
              >
                {serviceCategoriesData.map((category) => (
                  <ServiceCategoryCard key={category.id} {...category} />
                ))}
              </NavLink>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">In-Progress Jobs</h2>
                <NavLink
                  to={absoluteUrls.client.home.my_jobs}
                  className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
                >
                  <div className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer">
                    View all
                  </div>
                </NavLink>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 cursor-pointer">
                {inProgressJobsData.map((job: Job) => (
                  <InProgressJobCard
                    key={job.id}
                    job={job}
                    navigateToJob={`${absoluteUrls.client.home.my_jobs}/${job.id}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>

      <AllowAccessPopup
        accessPopup={accessPopup}
        setAccessPopup={setAccessPopup}
      />
    </div>
  );
};

export default Dashboard;

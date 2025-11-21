import { absoluteUrls } from "@/config/urls";
import {
  inProgressJobsData,
  jobOverviewData,
  serviceCategoriesData,
} from "@/dummy_data/dashboard";
import { earningsData } from "@/dummy_data/jobDetails";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import SidebarJobPostWallet from "../../../shared/components/SidebarJobPostWallet";
import AllowAccessPopup from "../auth/components/AccessPopup";
import InProgressJobCard from "./components/InProgressJobCard";
import JobOverviewCard from "./components/JobOverview";
import ServiceCategoryCard from "./components/ServiceCategoryCard";

/**
 * `Dashboard` component serves as the main dashboard for the client user.
 * It displays an overview of jobs, service categories, and in-progress jobs.
 * It also includes a sidebar with wallet and job posting information.
 */
const Dashboard: React.FC = () => {
  const [accessPopup, setAccessPopup] = React.useState<boolean>(false);

  useEffect(() => {
    setAccessPopup(true);
  }, []);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Job Overview</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
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
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Service Categories</h2>
                <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <NavLink
                    to={absoluteUrls.client.home.explore_engineers}
                    className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
                  >
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer">
                      View all
                    </button>
                  </NavLink>
                </nav>
              </div>

              <NavLink
                to={absoluteUrls.client.home.explore_engineers}
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
                <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <NavLink
                    to={absoluteUrls.client.home.my_jobs}
                    className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
                  >
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer">
                      View all
                    </button>
                  </NavLink>
                </nav>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 cursor-pointer">
                {inProgressJobsData.map((job) => (
                  <InProgressJobCard key={job.id} {...job} />
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
        onAllowLocation={() => console.log("Allow Location")}
        onAllowNotification={() => console.log("Allow Notification")}
      />
    </div>
  );
};

export default Dashboard;

import React from "react";
import {
  inProgressJobsData,
  jobOverviewData,
  serviceCategoriesData,
} from "@/dummy_data/dashboard";
import JobOverviewCard from "./components/JobOverview";
import ServiceCategoryCard from "./components/ServiceCategoryCard";
import InProgressJobCard from "./components/InProgressJobCard";
import SidebarJobPostWallet from "../../../shared/components/client/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import { NavLink } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

const Dashboard: React.FC = () => {
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
                <JobOverviewCard key={job.id} {...job} />
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
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      View all
                    </button>
                  </NavLink>
                </nav>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {serviceCategoriesData.map((category) => (
                  <ServiceCategoryCard key={category.id} {...category} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">In-Progress Jobs</h2>

                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};

export default Dashboard;

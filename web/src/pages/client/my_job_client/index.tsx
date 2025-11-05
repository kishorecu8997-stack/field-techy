import React, { useState,  useMemo } from "react";
import JobCard from "./components/JobCard";
import Header from "@/shared/components/ClientHeader";
import type { Job } from "./types";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import { jobData } from "@/dummy_data/myJobs";
import FilterButton from "@/shared/components/commonUI/FilterButton";

/**
 * `MyJobsClient` is the main page component for a client to view their jobs.
 * It displays a list of jobs that can be filtered by status (e.g., "All Jobs", "In-Progress").
 * The layout includes a main content area for job listings and a sidebar with wallet information.
 * @returns {React.ReactElement} The rendered "My Jobs" page for the client.
 */
const MyJobsClient: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All Jobs");

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All Jobs") {
      return jobData as Job[];
    }
    return (jobData as Job[]).filter((job) => job.status === activeFilter);
  }, [activeFilter]);
const jobFilters = ['All Jobs', 'In-Progress', 'Completed', 'Posted', 'Hold'];
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
              <Header currentPath="My Jobs" />
            </div>
            <div className="space-y-6">
              <FilterButton
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                filters={jobFilters}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No jobs match the selected filter.
                  </p>
                )}
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

export default MyJobsClient;
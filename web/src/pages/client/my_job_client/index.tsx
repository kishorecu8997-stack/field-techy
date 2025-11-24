import React, { useState, useMemo } from "react";
import JobCard from "./components/JobCard";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import { absoluteUrls } from "@/config/urls";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import jobFilters, { SORT_OPTIONS, type Job } from "../search_result/types";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import { useParams } from "react-router-dom";

/**
 * `MyJobsClient` is the main page component for a client to view their jobs.
 * It displays a list of jobs that can be filtered by status (e.g., "All Jobs", "In-Progress").
 * The layout includes a main content area for job listings and a sidebar with wallet information.
 * @returns {React.ReactElement} The rendered "My Jobs" page for the client.
 */
const MyJobsClient: React.FC = () => {
   const params = useParams();
  const [activeFilter, setActiveFilter] = useState<string>(jobFilters[0]);

  const filteredJobs = useMemo(() => {
    if (activeFilter === jobFilters[0]) {
      return sampleJobs as Job[];
    }
    if (activeFilter === jobFilters[1]) {
    return (sampleJobs as Job[]).filter((job) => job.status === "inprogress");
    }
    if (activeFilter === jobFilters[2]) {
    return (sampleJobs as Job[]).filter((job) => job.status === "completed");
    }
    if (activeFilter === jobFilters[3]) {
    return (sampleJobs as Job[]).filter((job) => job.status === "posted");
    }
    if (activeFilter === jobFilters[4]) {
    return (sampleJobs as Job[]).filter((job) => job.status === "hold");
    }
    return (sampleJobs as Job[]).filter((job) => job.status === activeFilter);
  }, [activeFilter]);
  

  return (
    
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
     <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title="My Jobs"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowBreadcrumb
          />
        </div>
      <div className="container mx-auto px-4 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <FilterButton
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                filters={jobFilters}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                    />
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

import React, { useState,  useMemo } from "react";
import JobFilter from "./components/JobFilter";
import JobCard from "./components/JobCard";
import Header from "@/shared/components/ClientHeader";
import type { Job } from "./types";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import { jobData } from "@/dummy_data/myJobs";

const MyJobsClient: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All Jobs");

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All Jobs") {
      return jobData as Job[];
    }
    return (jobData as Job[]).filter((job) => job.status === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
              <Header currentPath="My Jobs" />
            </div>
            <div className="space-xy-10 ">
              <JobFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
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
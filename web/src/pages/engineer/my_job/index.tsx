import { earningsData, userData } from "@/dummy_data/jobDetails";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { SORT_OPTIONS } from "../search_result/types";
import JobList from "./my_job_components/JobList";
import SidebarProfile from "./my_job_components/SidebarProfile";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { absoluteUrls} from "@/config/urls";

/**
 * Displays the engineer's dashboard with job listings and profile sidebar.
 * Includes a header with sorting controls and uses dummy data for user and earnings.
 */
const MyJobsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All Jobs");
  const navigate = useNavigate();
  const jobFilters = [
    "All Jobs",
    "Applied",
    "Today",
    "In Progress",
    "Completed",
    "Declined",
    "Cancelled",
   
  ];

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => {}}
          isReport
        />
        <div className="flex items-center justify-between mt-4">
        <FilterButton
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={jobFilters}
        />

       <button
        onClick={() => navigate(absoluteUrls.engineer.home.application_history)}
        className=" bg-teal-800 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition"
        >
        Application History
        </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <JobList />
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarProfile user={userData} earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;

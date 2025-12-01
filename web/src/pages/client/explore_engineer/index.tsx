import FilterPanel from "@/pages/client/search_result/components/FilterPanel";
import {
  SORT_OPTIONS,
  type Filters
} from "@/pages/client/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";
import EngineerListPage from "./components/EngineerListPage";

/**
 * `ExploreEngineer` is the main page component for browsing and finding engineers.
 * It renders a layout with a header, a list of engineers (`EngineerListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 */
const ExploreEngineer = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<Filters>({
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({
      location: [],
      category: [],
      rating: [],
      experience: 0,
      budgetType: null,
      skills: [],
    });
    setCurrentPage(1);
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 ">
          <div className="w-full sticky top-16 z-10 ">
          <MyJobsHeader
            title="Explore Engineers"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowBreadcrumb={false}
            description={`10 jobs found`} // ✅ Updated count
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="space-y-10">
              <EngineerListPage />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <FilterPanel
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAllFilters}
                currentFilters={filters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreEngineer;

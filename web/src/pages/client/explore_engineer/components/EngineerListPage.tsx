import React, { useEffect, useState } from "react";
import EngineerCard from "./EngineerCard";
import { mockEngineers } from "@/dummy_data/engineers";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import Pagination from "../../search_result/components/Pagination";
import { scrollToTop } from "@/utils";

/**
 * `EngineerListPage` is a component that displays a paginated list of engineers.
 * It includes functionality for filtering engineers by category and supports both
 * light and dark themes, which are automatically detected from system preferences.
 * The component manages its own state for theme, category selection, and pagination.
 * @returns {React.ReactElement} The rendered engineer list page.
 */
const EngineerListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Engineer");
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    scrollToTop();
  }, [currentPage]);
  const itemsPerPage = 8;

  // Categories
  const categories = [
    "All Engineer",
    "Cloud",
    "Networks",
    "Support",
    "Technician",
    "Security",
  ];

  const filteredEngineers = mockEngineers; // Add actual filtering logic if needed
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEngineers = filteredEngineers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6 ">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            activeFilter={selectedCategory}
            onFilterChange={setSelectedCategory}
            filters={categories}
          />
        </div>

        {/* Engineer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentEngineers.map((engineer) => (
            <EngineerCard key={engineer.id} engineer={engineer} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default EngineerListPage;

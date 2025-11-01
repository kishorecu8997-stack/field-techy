import React, { useState, useEffect } from "react";
import EngineerCard from "./EngineerCard";
import { mockEngineers } from "@/dummy_data/engineers";

/**
 * `EngineerListPage` is a component that displays a paginated list of engineers.
 * It includes functionality for filtering engineers by category and supports both
 * light and dark themes, which are automatically detected from system preferences.
 * The component manages its own state for theme, category selection, and pagination.
 * @returns {React.ReactElement} The rendered engineer list page.
 */
const EngineerListPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Engineer");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Detect system theme
  useEffect(() => {
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    setIsDarkMode(prefersDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      className={`p-4 md:p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } transition-colors duration-300`}
    >
      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? isDarkMode
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-700 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Engineer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentEngineers.map((engineer) => (
          <EngineerCard
            key={engineer.id}
            engineer={engineer}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? isDarkMode
                  ? "bg-emerald-600 text-white border border-emerald-500"
                  : "bg-white text-emerald-700 border border-emerald-500"
                : isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default EngineerListPage;

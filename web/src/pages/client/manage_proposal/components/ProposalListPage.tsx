import React, { useState, useEffect } from "react";
import { mockEngineers } from "@/dummy_data/engineers";
import ProposalCard from "./ProposalCard";

const ProposalListPage: React.FC = () => {
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

  // Filtered engineers (mock — in real app, filter by category)
  const filteredEngineers = mockEngineers; // Add actual filtering logic if needed

  // Pagination
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
         {/* Engineer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentEngineers.map((engineer) => (
          <ProposalCard
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

export default ProposalListPage;

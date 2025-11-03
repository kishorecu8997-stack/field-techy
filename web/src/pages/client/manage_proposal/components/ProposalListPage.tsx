import React, { useState, useEffect } from "react";
import { mockEngineers } from "@/dummy_data/engineers";
import ProposalCard from "./ProposalCard";
import Pagination from "../../search_result/components/Pagination";

/**
 * `ProposalListPage` is a component that displays a paginated list of proposals from engineers.
 * It uses the `ProposalCard` to render each individual proposal.
 * The component supports both light and dark themes, automatically detected from system preferences,
 * and manages its own state for theme and pagination.
 * @returns {React.ReactElement} The rendered list of proposals with pagination.
 */
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
          <ProposalCard key={engineer.id} engineer={engineer} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProposalListPage;

import { mockEngineers } from "@/dummy_data/engineers";
import React, { useState } from "react";
import Pagination from "../../search_result/components/Pagination";
import ProposalCard from "./ProposalCard";

/**
 * `ProposalListPage` is a component that displays a paginated list of proposals from engineers.
 * It uses the `ProposalCard` to render each individual proposal.
 * The component supports both light and dark themes, automatically detected from system preferences,
 * and manages its own state for theme and pagination.
 * @returns {React.ReactElement} The rendered list of proposals with pagination.
 */
const ProposalListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filtered engineers (mock — in real app, filter by category)
  const filteredEngineers = mockEngineers; // Add actual filtering logic if needed

  // Pagination
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEngineers = filteredEngineers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div>
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

import React, { useState } from "react";
import { mockEngineers } from "@/dummy_data/engineers";
import Pagination from "@/pages/client/search_result/components/Pagination";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { SORT_OPTIONS, type Filters } from "@/pages/client/search_result/types";
import FilterPanel from "@/pages/client/search_result/components/FilterPanel";
import EngineerInviteCard from "./EngineerInviteCard";
import Popup from "@/shared/components/Popup";
import InvitationSentModal from "./InvitationSentModal";

interface SelectInviteJobCardProps {
  onClose: () => void;
}

/**
 * `EngineerListPage` is a component that displays a paginated list of engineers.
 * It includes functionality for filtering engineers by category and supports both
 * light and dark themes, which are automatically detected from system preferences.
 * The component manages its own state for theme, category selection, and pagination.
 * @returns {React.ReactElement} The rendered engineer list page.
 */
const EngineerInviteListPage: React.FC<SelectInviteJobCardProps> = (onClose) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [invitedEngineers, setInvitedEngineers] = useState<number[]>([]);
  const itemsPerPage = 8;

  const filteredEngineers = mockEngineers; // Add actual filtering logic if needed
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEngineers = filteredEngineers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const [filters, setFilters] = useState<Filters>({
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
  });

  const handleInviteToggle = (engineerId: number) => {
    setInvitedEngineers((prevInvited) =>
      prevInvited.includes(engineerId)
        ? prevInvited.filter((id) => id !== engineerId)
        : [...prevInvited, engineerId]
    );
  };
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
      <div className="container mx-auto px-4 py-6">
        <div className="sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title="Explore Engineers"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowBreadcrumb={false}
            description={`10 jobs found`} // ✅ Updated count
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Engineer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentEngineers.map((engineer) => (
                <EngineerInviteCard
                  key={engineer.id}
                  engineer={engineer}
                  onInviteToggle={() => handleInviteToggle(engineer.id)}
                />
              ))}
            </div>
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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
       {/* <Popup open={isOpen} onClose={onClose}>
        <InvitationSentModal onClose={() => setIsOpen(false)} />
      </Popup> */}
    </div>
  );
};

export default EngineerInviteListPage;

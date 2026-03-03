import React, { useEffect, useState } from "react";
import EngineerCard from "./EngineerCard";
import Pagination from "../../search_result/components/Pagination";
import { scrollToTop } from "@/utils";
import { useClientExploreEngineers } from "@/shared/apiServices/client/clientOpenApiService";
import type { FiltersType } from "../index";

interface EngineerListPageProps {
  filters: FiltersType;
  onTotalEngineerCountChange?: (count: number) => void;
}

/**
 * `EngineerListPage` is a component that displays a paginated list of engineers.
 * It includes functionality for filtering engineers by category and supports both
 * light and dark themes, which are automatically detected from system preferences.
 * The component manages its own state for theme, category selection, and pagination.
 * @returns {React.ReactElement} The rendered engineer list page.
 */
const EngineerListPage: React.FC<EngineerListPageProps> = ({ filters, onTotalEngineerCountChange }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    scrollToTop();
  }, [currentPage]);
  const itemsPerPage = 8;
  const { data, isLoading } = useClientExploreEngineers(
    {
      page: currentPage,
      limit: itemsPerPage,
      jobType:
        filters.location === 1
          ? "On site"
          : filters.location === 2
            ? "Remote"
            : filters.location === 3
              ? "Hybrid"
              : undefined,
      serviceCategoryId: filters.category ?? undefined,
      minRating: filters.rating ?? undefined,
      experienceYears: filters.experience > 0 ? filters.experience : undefined,
      skillIds:
        filters.skills.size > 0
          ? Array.from(filters.skills).map((id) => id.toString())
          : undefined,
    },
    true,
  );
  const engineers = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / itemsPerPage);
  
  // Notify parent of total engineer count
  useEffect(() => {
    if (onTotalEngineerCountChange && data?.total) {
      onTotalEngineerCountChange(data.total);
    }
  }, [data?.total, onTotalEngineerCountChange]);

  const mappedEngineers = engineers.map((engineer) => ({
    id: String(engineer.id),
    name: engineer.name,
    rating: Number(engineer.averageRating),
    reviewCount: engineer.reviewCount,
    title: engineer.serviceCategoryName ?? "Engineer",
    imageUrl: engineer.profilePictureUrl ?? "",
    pay_type: engineer.hourlyRate ? `$${engineer.hourlyRate}/hr` : "N/A",
    availability: engineer.isEmployed ? "Busy" : "Available",
  }));

  if (isLoading) {
    return <div className="text-center py-10">Loading engineers...</div>;
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6 ">
        {/* Engineer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {mappedEngineers.length === 0 ? (
            <div className="col-span-full flex justify-center items-center min-h-[15rem]">
              <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
                No engineers found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            mappedEngineers.map((engineer) => (
              <EngineerCard key={engineer.id} engineer={engineer} />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EngineerListPage;

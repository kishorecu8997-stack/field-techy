import MyJobsHeader from "@/shared/components/MyJobsHeader";
import EngineerListPage from "./components/EngineerListPage";
import Filters from "@/shared/components/Filters";
import { SORT_OPTIONS } from "@/pages/client/search_result/types";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export type FiltersType = {
  location: number | null;
  category: number | null;
  rating: number | null;
  experience: number;
  skills: Set<number>;
};

/**
 * `ExploreEngineer` is the main page component for browsing and finding engineers.
 * It renders a layout with a header, a list of engineers (`EngineerListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 */
const ExploreEngineer = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL params and convert to number
  const categoryFromUrl = searchParams.get("category");
  const initialCategory = categoryFromUrl
    ? parseInt(categoryFromUrl, 10)
    : null;

  // Filter state - initialize with category from URL
  const [filters, setFilters] = useState<FiltersType>({
    location: null,
    category: initialCategory,
    rating: null,
    experience: 0,
    skills: new Set(),
  });

  const [totalEngineerCount, setTotalEngineerCount] = useState<number>(0);

  // Update URL when category filter changes
  const handleFilterChange = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };

      // Update URL params when category changes
      if (newFilters.category !== undefined) {
        if (newFilters.category === null) {
          searchParams.delete("category");
        } else {
          searchParams.set("category", String(newFilters.category));
        }
        setSearchParams(searchParams, { replace: true });
      }

      return updatedFilters;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
      location: null,
      category: null,
      rating: null,
      experience: 0,
      skills: new Set(),
    });
    // Clear category from URL
    searchParams.delete("category");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="w-full sticky top-16 z-10">
          <MyJobsHeader
            title="Explore Engineers"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowSort={false}
            isShowBreadcrumb={false}
            description={`${totalEngineerCount}+ engineers found`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Engineer List */}
          <div className="lg:col-span-2">
            <EngineerListPage
              filters={filters}
              onTotalEngineerCountChange={setTotalEngineerCount}
            />
          </div>

          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Filters
                selectedLocation={filters.location}
                onLocationChange={(location) =>
                  handleFilterChange({ location })
                }
                selectedCategory={filters.category}
                onCategoryChange={(category) =>
                  handleFilterChange({ category })
                }
                rating={
                  filters.rating
                    ? (String(filters.rating) as "1" | "2" | "3" | "4" | "5")
                    : undefined
                }
                onRatingChange={(rating) =>
                  handleFilterChange({ rating: rating ? Number(rating) : null })
                }
                experience={filters.experience}
                onExperienceChange={(experience) =>
                  handleFilterChange({ experience })
                }
                selectedSkills={filters.skills}
                onSkillToggle={(skillId) => {
                  const newSkills = new Set(filters.skills);
                  if (newSkills.has(skillId)) newSkills.delete(skillId);
                  else newSkills.add(skillId);
                  handleFilterChange({ skills: newSkills });
                }}
                onClearAll={handleClearAllFilters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreEngineer;

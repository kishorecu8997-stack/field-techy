import MyJobsHeader from "@/shared/components/MyJobsHeader";
import EngineerListPage from "./components/EngineerListPage";
import Filters from "@/shared/components/Filters";
import { SORT_OPTIONS } from "@/pages/client/search_result/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export type FiltersType = {
  q: string;
  country: string;
  state: string;
  city: string;
  location: number | null;
  category: number | null;
  rating: number | null;
  experience: number;
  skills: Set<number>;
  regionId?: number | null;
};

/**
 * `ExploreEngineer` is the main page component for browsing and finding engineers.
 * It renders a layout with a header, a list of engineers (`EngineerListPage`),
 * and a set of filters (`Filters`) in a sidebar.
 */
const ExploreEngineer = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state - initialize from URL params
  const [filters, setFilters] = useState<FiltersType>(() => ({
    q: searchParams.get("q") || "",
    country: searchParams.get("country") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    location: null,
    category: searchParams.get("category")
      ? parseInt(searchParams.get("category")!, 10)
      : null,
    rating: null,
    experience: 0,
    skills: new Set(),
    regionId: null,
  }));

  const [totalEngineerCount, setTotalEngineerCount] = useState<number>(0);

  // Sync state with URL manually (for external changes like SearchBar)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      q: searchParams.get("q") || "",
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      category: searchParams.get("category")
        ? parseInt(searchParams.get("category")!, 10)
        : null,
    }));
  }, [searchParams]);

  // Update URL when filters change
  const handleFilterChange = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };
      const newParams = new URLSearchParams(searchParams);

      if (updatedFilters.q) newParams.set("q", updatedFilters.q);
      else newParams.delete("q");

      if (updatedFilters.country)
        newParams.set("country", updatedFilters.country);
      else newParams.delete("country");

      if (updatedFilters.state) newParams.set("state", updatedFilters.state);
      else newParams.delete("state");

      if (updatedFilters.city) newParams.set("city", updatedFilters.city);
      else newParams.delete("city");

      if (updatedFilters.category !== null)
        newParams.set("category", String(updatedFilters.category));
      else newParams.delete("category");

      setSearchParams(newParams, { replace: true });
      return updatedFilters;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
      q: "",
      country: "",
      state: "",
      city: "",
      location: null,
      category: null,
      rating: null,
      experience: 0,
      skills: new Set(),
    });
    setSearchParams({}, { replace: true });
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
                isRegionFilterEnabled
                selectedRegion={filters.regionId}
                onRegionChange={(regionId) =>
                  handleFilterChange({ regionId })
                }
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

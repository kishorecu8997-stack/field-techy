import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
import type {
  BudgetValue,
  RatingValue,
} from "@/shared/libs/constants/filterOptions";
import { RATING_OPTIONS } from "@/shared/libs/constants/filterOptions";
import React, { useMemo } from "react";
import { usePopupStore } from "../store/popupStore";
import { Button } from "./commonUI/Buttons";

interface SkillItem {
  id: number;
  name: string;
  selected: boolean;
}

interface FiltersProps {
  selectedLocation?: number | null;
  onLocationChange?: (locationId: number | null) => void;
  selectedCategory?: number | null;
  onCategoryChange?: (categoryId: number | null) => void;
  budget?: BudgetValue | null;
  onBudgetChange?: (budget: BudgetValue | null) => void;
  rating?: RatingValue | null;
  onRatingChange?: (rating: RatingValue | null) => void;
  experience?: number;
  onExperienceChange?: (experience: number) => void;
  selectedSkills?: Set<number>;
  isRegionFilterEnabled?: boolean;
  selectedRegion?: number | null;
  onRegionChange?: (regionId: number | null) => void;
  onSkillToggle?: (skillId: number) => void;
  onClearAll?: () => void;
}

/*
 * Filters
 *
 * A component that displays a filter panel for job listings.
 * It includes options for location, budget, rating, experience, and skills.
 * All data is fetched from lookup APIs instead of hardcoded values.
 *
 * @returns {JSX.Element} The rendered filter panel component.
 * @constructor
 */
const Filters: React.FC<FiltersProps> = ({
  selectedLocation = null,
  onLocationChange = () => {},
  onRegionChange = () => {},
  selectedCategory = null,
  onCategoryChange = () => {},
  rating = null,
  onRatingChange = () => {},
  experience = 0,
  isRegionFilterEnabled = false,
  selectedRegion = null,
  onExperienceChange = () => {},
  selectedSkills = new Set(),
  onSkillToggle = () => {},
  onClearAll = () => {},
}) => {
  // Fetch lookup data
  const { data: workLocations, isLoading: isLoadingLocations } =
    useLookupData("workLocations");
  const { data: serviceCategories, isLoading: isLoadingCategories } =
    useLookupData("serviceCategories");
  const { data: skillsData, isLoading: isLoadingSkills } =
    useLookupData("skills");
  const { data: regions } = useLookupData("regions");

  // Transform skills data to include selection state
  const skills = useMemo<SkillItem[]>(() => {
    if (!skillsData) return [];
    return skillsData.map((skill) => ({
      id: skill.id,
      name: skill.name,
      selected: selectedSkills.has(skill.id),
    }));
  }, [skillsData, selectedSkills]);
  const [showAllSkills, setShowAllSkills] = React.useState<boolean>(false);
  const visibleSkills = showAllSkills ? skills : skills.slice(0, 6);

  const { showPopup } = usePopupStore();

  const handleConfirmClearAll = async () => {
    await showPopup({
      title: "Clear All Filters",
      body: "Are you sure you want to clear all filters?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes, clear",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            onClearAll();
            close(true);
          },
        },
      ],
    });
  };

  // Loading state
  const isLoading =
    isLoadingLocations || isLoadingCategories || isLoadingSkills;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-300">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            Loading filters...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <div
          onClick={handleConfirmClearAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline cursor-pointer"
        >
          CLEAR ALL
        </div>
      </div>

      {/* Regions */}
      {isRegionFilterEnabled && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">Regions</h3>
          <div className="flex flex-wrap gap-2">
            {regions?.map((region) => (
              <Button
                key={region.id}
                onClick={() => onRegionChange(region.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRegion === region.id
                    ? "bg-teal-800 dark:bg-teal text-white"
                    : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
                }`}
              >
                {region.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Work Location (Job Type) */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Job Type</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onLocationChange(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLocation === null
                ? "bg-teal-800 dark:bg-teal text-white"
                : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
            }`}
          >
            All
          </Button>
          {workLocations?.map((location) => (
            <Button
              key={location.id}
              onClick={() => onLocationChange(location.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLocation === location.id
                  ? "bg-teal-800 dark:bg-teal text-white"
                  : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
              }`}
            >
              {location.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Service Category */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-teal-800 dark:bg-teal text-white"
                : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
            }`}
          >
            All
          </Button>
          {serviceCategories?.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-teal-800 dark:bg-teal text-white"
                  : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Rating</h3>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => onRatingChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                rating === option.value
                  ? "bg-teal-800 dark:bg-teal text-white"
                  : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h3 className="font-medium mb-6">Experience</h3>
        <div className="relative px-2">
          <input
            type="range"
            min="0"
            max="10"
            value={experience}
            onChange={(e) => onExperienceChange(parseInt(e.target.value) || 0)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-600"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${
                (experience / 10) * 100
              }%, #d1d5db ${(experience / 10) * 100}%, #d1d5db 100%)`,
            }}
          />
          {/* Dynamic tooltip */}
          <div
            className="absolute top-[-22px] transform -translate-x-1/2 px-2 py-1 rounded-2xl text-xs font-medium whitespace-nowrap bg-emerald-700 text-white dark:bg-emerald-600"
            style={{
              left: `${(experience / 10) * 100}%`,
            }}
          >
            {experience === 0
              ? "No Experience"
              : `${experience} ${experience === 1 ? "Year" : "Years"}`}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill) => (
            <Button
              key={skill.id}
              onClick={() => onSkillToggle(skill.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                skill.selected
                  ? "bg-teal-800 dark:bg-teal text-white"
                  : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
              }`}
            >
              {skill.name}
            </Button>
          ))}
        </div>

        {skills.length > 6 && (
          <Button
            variant="text"
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="mt-2 text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline"
          >
            {showAllSkills ? "Show Less" : "View All"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Filters;

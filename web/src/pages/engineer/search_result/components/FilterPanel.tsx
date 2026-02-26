import React, { useState, useEffect } from "react";
import type { Filters } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import { useLookupData } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { JOB_TYPES_ARRAY, type JobType } from "@/constants/jobTypes";

/**
 * FilterPanel component provides filtering options for job listings
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback function when filters change
 * @param {Function} props.onClearAll - Callback function to clear all filters
 * @param {Filters} props.currentFilters - Current filter state
 * @returns {JSX.Element} Rendered filter panel component
 */
const FilterPanel: React.FC<{
  onFilterChange: (filters: Filters) => void;
  onClearAll: () => void;
  currentFilters: Filters;
}> = ({ onFilterChange, onClearAll, currentFilters }) => {
  // Fetch lookup data

  const { data: serviceCategories, isLoading: isLoadingCategories } =
    useLookupData("serviceCategories");
  const { data: skillsData, isLoading: isLoadingSkills } =
    useLookupData("skills");

  // Local state for filters
  const [selectedJobType, setSelectedJobType] = useState<string>(
    (currentFilters.jobTypeEnum as JobType) || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    currentFilters.category || [],
  );

  const [experience, setExperience] = useState<number>(
    currentFilters.experience || 0,
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentFilters.skills || [],
  );

  // Sync local state with currentFilters when they change
  useEffect(() => {
    setSelectedJobType((currentFilters.jobTypeEnum as JobType) || "");
    setSelectedCategory(currentFilters.category || []);
    setExperience(currentFilters.experience || 0);
    setSelectedSkills(currentFilters.skills || []);
  }, [currentFilters]);

  /**
   * Handle toggle of filter options
   * @param {string[]} currentSelection - Current selection array
   * @param {string} value - Value to toggle
   * @param {Function} setter - State setter function
   * @param {string} filterKey - Key in the Filters object
   */
  const toggleFilter = (
    currentSelection: string[],
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    filterKey: keyof Filters,
  ) => {
    const newSelection = [...currentSelection];
    const index = newSelection.indexOf(value);
    if (index > -1) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(value);
    }
    setter(newSelection);
    updateFilters({
      ...currentFilters,
      [filterKey]: newSelection,
    });
  };

  /**
   * Update filters state
   * @param {Filters} newFilters - New filter state
   */
  const updateFilters = (newFilters: Filters) => {
    onFilterChange(newFilters);
  };

  const handleJobTypeSelect = (value: JobType) => {
    // If clicking the same one, clear it (optional), otherwise set to new value
    const newValue = selectedJobType === value ? "" : value;
    setSelectedJobType(newValue);
    onFilterChange({
      ...currentFilters,
      jobTypeEnum: newValue,
    });
  };

  /**
   * Clear all filters
   */
  const handleClearAll = () => {
    setSelectedJobType("");
    setSelectedCategory([]);
    setExperience(0);
    setSelectedSkills([]);
    onClearAll();
  };

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
            handleClearAll();
            close(true);
          },
        },
      ],
    });
  };

  // Loading state
  const isLoading = isLoadingCategories || isLoadingSkills;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 h-fit border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            Loading filters...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 h-fit border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          Filters
        </h2>
        <div
          onClick={handleConfirmClearAll}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
        >
          CLEAR ALL
        </div>
      </div>

      {/* Job Type Filter (Work Location) */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          Job Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES_ARRAY?.map((jobType, key) => {
            // Cast the name to your specific JobType
            const locName = jobType.label;

            return (
              <button
                key={key}
                onClick={() => handleJobTypeSelect(locName as JobType)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  selectedJobType === locName
                    ? "bg-green-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {jobType.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {serviceCategories?.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                toggleFilter(
                  selectedCategory,
                  String(category.id),
                  setSelectedCategory,
                  "category",
                )
              }
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory.includes(String(category.id))
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          Experience
        </h3>
        <div className="relative pt-6">
          <input
            type="range"
            min="0"
            max="10"
            value={experience}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setExperience(value);
              updateFilters({
                ...currentFilters,
                experience: value,
              });
            }}
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${
                (experience / 10) * 100
              }%, #d1d5db ${(experience / 10) * 100}%, #d1d5db 100%)`,
            }}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider "
          />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 bg-green-700 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
            {experience} Years
          </div>
        </div>
      </div>

      {/* Skills Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skillsData?.slice(0, 9).map((skill) => (
            <button
              key={skill.id}
              onClick={() =>
                toggleFilter(
                  selectedSkills,
                  String(skill.id),
                  setSelectedSkills,
                  "skills",
                )
              }
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedSkills.includes(String(skill.id))
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {skill.name}
            </button>
          ))}
        </div>
        <button className="text-sm text-teal-800 dark:text-teal-400 mt-2 hover:underline font-medium cursor-pointer">
          View all
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;

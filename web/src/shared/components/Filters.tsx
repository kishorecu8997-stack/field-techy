import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
import type {
  BudgetValue,
  RatingValue,
} from "@/shared/libs/constants/filterOptions";
import {
  BUDGET_OPTIONS,
  RATING_OPTIONS,
} from "@/shared/libs/constants/filterOptions";
import React, { useState, useMemo } from "react";
import { usePopupStore } from "../store/popupStore";
import { Button } from "./commonUI/Buttons";

interface SkillItem {
  id: number;
  name: string;
  selected: boolean;
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
const Filters: React.FC = () => {
  // Fetch lookup data
  const { data: workLocations, isLoading: isLoadingLocations } = useLookupData("workLocations");
  const { data: serviceCategories, isLoading: isLoadingCategories } = useLookupData("serviceCategories");
  const { data: skillsData, isLoading: isLoadingSkills } = useLookupData("skills");

  // State management
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [budget, setBudget] = useState<BudgetValue>("hourly");
  const [rating, setRating] = useState<RatingValue>("1");
  const [experience, setExperience] = useState<number>(5);
  const [selectedSkills, setSelectedSkills] = useState<Set<number>>(new Set());
  const [showAllSkills, setShowAllSkills] = useState<boolean>(false);

  // Transform skills data to include selection state
  const skills = useMemo<SkillItem[]>(() => {
    if (!skillsData) return [];
    return skillsData.map((skill) => ({
      id: skill.id,
      name: skill.name,
      selected: selectedSkills.has(skill.id),
    }));
  }, [skillsData, selectedSkills]);

  const toggleSkill = (skillId: number) => {
    setSelectedSkills((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSelectedLocation(null);
    setSelectedCategory(null);
    setBudget("hourly");
    setRating("1");
    setExperience(5);
    setSelectedSkills(new Set());
  };

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
            clearAllFilters();
            close(true);
          },
        },
      ],
    });
  };

  // Loading state
  const isLoading = isLoadingLocations || isLoadingCategories || isLoadingSkills;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-300">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading filters...</div>
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

      {/* Work Location (Job Type) */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Job Type</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedLocation(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLocation === null
              ? "bg-teal-800 dark:bg-teal text-white"
              : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
              }`}
          >
            All
          </Button>
          {workLocations?.map((location) => (
            <Button
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLocation === location.id
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
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === null
              ? "bg-teal-800 dark:bg-teal text-white"
              : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
              }`}
          >
            All
          </Button>
          {serviceCategories?.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                ? "bg-teal-800 dark:bg-teal text-white"
                : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
                }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Budget</h3>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => setBudget(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${budget === option.value
                ? "bg-teal-800 dark:bg-teal text-white"
                : "dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-teal-500 dark:hover:bg-gray-700"
                }`}
            >
              {option.label}
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
              onClick={() => setRating(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${rating === option.value
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
            onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-600"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${(experience / 10) * 100
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
              onClick={() => toggleSkill(skill.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${skill.selected
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

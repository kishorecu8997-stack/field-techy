import React, { useState } from 'react';
import type { Filters } from '../types';
import { usePopupStore } from '@/shared/store/popupStore';

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
  const [selectedLocation, setSelectedLocation] = useState<string[]>(currentFilters.location || []);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(currentFilters.category || []);
  const [selectedRating, setSelectedRating] = useState<number[]>(currentFilters.rating || []);
  const [experience, setExperience] = useState<number>(currentFilters.experience || 0);
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed' | ''>(currentFilters.budgetType || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentFilters.skills || []);

  // Available filter options
  const locationOptions = ['On-Site', 'Remote', 'Hybrid'];
  const categoryOptions = ['IT', 'Construction', 'Designing', 'Sale', 'Teaching', 'Animation', 'More'];
  const ratingOptions = [1, 2, 3, 4, 5];
  const budgetOptions = ['Hourly Price', 'Fixed Price'];
  const skillOptions = [
    'Figma', 'Adobe XD', 'PhotoShop', 'Motion Graphics', 
    'Animations', 'UI/UX', 'SQL', 'PowerPoint', 'Adobe Suit'
  ];

  /**
   * Handle toggle of filter options
   * @param {string[]} currentSelection - Current selection array
   * @param {string} value - Value to toggle
   * @param {Function} setter - State setter function
   */
  const toggleFilter = (currentSelection: string[], value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
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
      [setter === setSelectedLocation ? 'location' : 
       setter === setSelectedCategory ? 'category' : 
       setter === setSelectedSkills ? 'skills' : '']: newSelection
    });
  };

  /**
   * Handle toggle of rating filter
   * @param {number} rating - Rating to toggle
   */
  const toggleRating = (rating: number) => {
    const newRatings = [...selectedRating];
    const index = newRatings.indexOf(rating);
    if (index > -1) {
      newRatings.splice(index, 1);
    } else {
      newRatings.push(rating);
    }
    setSelectedRating(newRatings);
    updateFilters({
      ...currentFilters,
      rating: newRatings
    });
  };

  /**
   * Update filters state
   * @param {Filters} newFilters - New filter state
   */
  const updateFilters = (newFilters: Filters) => {
    onFilterChange(newFilters);
  };

  /**
   * Clear all filters
   */
  const handleClearAll = () => {
    setSelectedLocation([]);
    setSelectedCategory([]);
    setSelectedRating([]);
    setExperience(0);
    setBudgetType('');
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


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 h-fit border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Filters</h2>
        <div 
          onClick={handleConfirmClearAll}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
        >
          CLEAR ALL
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Location</h3>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map(option => (
            <button
              key={option}
              onClick={() => toggleFilter(selectedLocation, option, setSelectedLocation)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedLocation.includes(option)
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map(option => (
            <button
              key={option}
              onClick={() => toggleFilter(selectedCategory, option, setSelectedCategory)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory.includes(option)
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Rating</h3>
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map(rating => (
            <button
              key={rating}
              onClick={() => toggleRating(rating)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedRating.includes(rating)
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {rating} Star
            </button>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Experience</h3>
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
                experience: value
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

      {/* Budget Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Budget</h3>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map(option => (
            <button
              key={option}
              onClick={() => {
                const type = option.toLowerCase().includes('hourly') ? 'hourly' : 'fixed';
                setBudgetType(type);
                updateFilters({
                  ...currentFilters,
                  budgetType: type
                });
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                budgetType === (option.toLowerCase().includes('hourly') ? 'hourly' : 'fixed')
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Filter */}
      <div className="mb-5">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skillOptions.slice(0, 9).map(skill => (
            <button
              key={skill}
              onClick={() => toggleFilter(selectedSkills, skill, setSelectedSkills)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedSkills.includes(skill)
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-2 cursor-pointer">
          View All
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
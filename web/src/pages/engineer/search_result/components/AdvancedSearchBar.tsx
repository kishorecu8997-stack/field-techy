import React, { useState, useEffect } from 'react';
import type { Filters, SortOption } from '../types';
import skillsData from '@/dummy_data/skills.json';
import toolsData from '@/dummy_data/tools.json';

/**
 * AdvancedSearchBar component provides advanced filtering options for job listings
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback function when filters change
 * @param {Filters} props.currentFilters - Current filter state
 * @param {SortOption} props.sortOption - Current sort option
 * @param {Function} props.onSortChange - Callback function when sort changes
 * @returns {JSX.Element} Rendered advanced search bar component
 */
const AdvancedSearchBar: React.FC<{
  onFilterChange: (filters: Filters) => void;
  currentFilters: Filters;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSaveCurrentSearch: () => void;
}> = ({ onFilterChange, currentFilters, sortOption, onSortChange, onSaveCurrentSearch }) => {
  const [localFilters, setLocalFilters] = useState<Filters>(() => {
    // Load filters from session storage on initial render
    const savedFilters = sessionStorage.getItem('advancedSearchFilters');
    return savedFilters ? JSON.parse(savedFilters) : currentFilters;
  });

  const serviceTypeOptions = ['Dedicated', 'Dispatch', 'Scheduled'];
  const experienceLevelOptions = ['Entry', 'Mid', 'Senior', 'Lead'];
  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract'];
  const locationTypeOptions = ['On-site', 'Remote', 'Hybrid'];
  const locationOptions = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  const primaryLanguageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const slaLevelOptions = ['4 hours', '6 hours', 'next-day', 'thereafter'];

  const skillsOptions = skillsData.skills.map(skill => skill.label);
  const toolsOptions = toolsData.tools.map(tool => tool.label);

  // Save filters to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem('advancedSearchFilters', JSON.stringify(localFilters));
  }, [localFilters]);

  const handleMultiSelectChange = (field: keyof Filters, value: string) => {
    const currentValues = localFilters[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    const updatedFilters = { ...localFilters, [field]: newValues };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSingleSelectChange = (field: keyof Filters, value: string) => {
    const updatedFilters = { ...localFilters, [field]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSliderChange = (field: keyof Filters, value: number) => {
    const updatedFilters = { ...localFilters, [field]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleBudgetRangeChange = (min: number, max: number) => {
    const updatedFilters = { ...localFilters, budgetRange: { min, max } };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.serviceType.length > 0) count++;
    if (localFilters.experienceLevel.length > 0) count++;
    if (localFilters.jobType.length > 0) count++;
    if (localFilters.locationType.length > 0) count++;
    if (localFilters.location.length > 0) count++;
    if (localFilters.primaryLanguage) count++;
    if (localFilters.slaLevel) count++;
    if (localFilters.locationRadius !== 0) count++;
    if (localFilters.budgetRange.min !== 0 || localFilters.budgetRange.max !== 10000) count++;
    if (localFilters.tools.length > 0) count++;
    if (localFilters.skills.length > 0) count++;
    return count;
  };

  const handleClearAllFilters = () => {
    const defaultFilters: Filters = {
      location: [],
      category: [],
      rating: [],
      experience: 0,
      budgetType: null,
      skills: [],
      serviceType: [],
      tools: [],
      experienceLevel: [],
      jobType: [],
      locationType: [],
      locationRadius: 0,
      budgetRange: { min: 0, max: 10000 },
      primaryLanguage: '',
      slaLevel: '',
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const handleSaveSearch = () => {
    onSaveCurrentSearch();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700 w-full">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveSearch}
            className="px-4 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save This Search
          </button>
          <button
            onClick={handleClearAllFilters}
            className="px-4 py-2 text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 transition-colors font-medium"
          >
            Clear All Filters
          </button>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-4 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-medium"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="salary">Salary</option>
            <option value="distance">Distance</option>
          </select>
        </div>
        {getActiveFilterCount() > 0 && (
          <span className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200 font-medium">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
          </span>
        )}
      </div>

      {/* First Row */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        {/* Service Type */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Type</label>
          <div className="flex flex-wrap gap-1">
            {serviceTypeOptions.map(option => (
              <button
                key={option}
                onClick={() => handleMultiSelectChange('serviceType', option)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  (localFilters.serviceType as string[]).includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
          <div className="flex flex-wrap gap-1">
            {experienceLevelOptions.map(option => (
              <button
                key={option}
                onClick={() => handleMultiSelectChange('experienceLevel', option)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  (localFilters.experienceLevel as string[]).includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Job Type */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
          <div className="flex flex-wrap gap-1">
            {jobTypeOptions.map(option => (
              <button
                key={option}
                onClick={() => handleMultiSelectChange('jobType', option)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  (localFilters.jobType as string[]).includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Location Type */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location Type</label>
          <div className="flex flex-wrap gap-1">
            {locationTypeOptions.map(option => (
              <button
                key={option}
                onClick={() => handleMultiSelectChange('locationType', option)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  (localFilters.locationType as string[]).includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Language */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Language</label>
          <select
            value={localFilters.primaryLanguage}
            onChange={(e) => handleSingleSelectChange('primaryLanguage', e.target.value)}
            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Language</option>
            {primaryLanguageOptions.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* SLA Level */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SLA Level</label>
          <select
            value={localFilters.slaLevel}
            onChange={(e) => handleSingleSelectChange('slaLevel', e.target.value)}
            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select SLA Level</option>
            {slaLevelOptions.map(sla => (
              <option key={sla} value={sla}>{sla}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Location Radius */}
        <div className="flex flex-col justify-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location Radius: {localFilters.locationRadius} km
          </label>
          <input
            type="range"
            min="0"
            max="150"
            value={localFilters.locationRadius}
            onChange={(e) => handleSliderChange('locationRadius', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Budget Range */}
        <div className="flex flex-col justify-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget Range: ${localFilters.budgetRange.min} - ${localFilters.budgetRange.max}
          </label>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="10000"
              value={localFilters.budgetRange.min}
              onChange={(e) => handleBudgetRangeChange(parseInt(e.target.value), localFilters.budgetRange.max)}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={localFilters.budgetRange.max}
              onChange={(e) => handleBudgetRangeChange(localFilters.budgetRange.min, parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Tools */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tools</label>
          <div className="max-h-20 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
            {toolsOptions.map(tool => (
              <label key={tool} className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={(localFilters.tools as string[]).includes(tool)}
                  onChange={() => handleMultiSelectChange('tools', tool)}
                  className="mr-2"
                />
                {tool}
              </label>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
          <div className="max-h-20 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
            {skillsOptions.map(skill => (
              <label key={skill} className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={(localFilters.skills as string[]).includes(skill)}
                  onChange={() => handleMultiSelectChange('skills', skill)}
                  className="mr-2"
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="min-h-[80px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
          <div className="max-h-20 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
            {locationOptions.map(location => (
              <label key={location} className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={(localFilters.location as string[]).includes(location)}
                  onChange={() => handleMultiSelectChange('location', location)}
                  className="mr-2"
                />
                {location}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchBar;

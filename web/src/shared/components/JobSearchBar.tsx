import { absoluteUrls } from "@/config/urls";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaSearch, FaChartBar } from "react-icons/fa"; 
import { useLocation, useNavigate } from "react-router-dom";
import { InputField } from "./commonUI/inputs";
import { FormContainer } from "./commonUI/inputs/FormContainer";

/**
 * A search bar component for job search.
 *
 * @component
 * @example
 * <JobSearchBar /> 
 *
 */

export const JobSearchBar = () => {
  const methods = useForm({});
  const navigate = useNavigate();
  const location = useLocation();

  // Store previous path ONLY once
  const prevPathRef = useRef<string | null>(null);

  // Suggestions array
  const suggestions = [
    "Software Engineer",
    "Python Engineer",
    "Project Manager",
    "Senior Product Designer",
    "Looking for a talented graphic designer",
    "Junior Web Designer",
    "Innovate Tech",
    "Full Stack Developer",
    "Front-End Developer",
    "Back-End Developer",
    "Senior Product Designer"
  ];

  // State for filtered suggestions and dropdown visibility
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const hasValue = (value: any): boolean => {
    return value !== undefined && value !== null && String(value).trim() !== "";
  };

  const handleNavigate = (value: string) => {
    // Save previous path ONLY on first change
    if (!prevPathRef.current) {
      prevPathRef.current = location.pathname;
      console.log("Saved previous path:", prevPathRef.current);
    }

    if (hasValue(value)) {
      navigate(`${absoluteUrls.engineer.home.search_result}`);
    } else {
      navigate(absoluteUrls.engineer.home.dashboard);
    }
  };

  const handleSearchChange = (value: string) => {
    handleNavigate(value); // Keep existing navigation
    if (value.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    methods.setValue("searchQuery", suggestion);
    setShowDropdown(false);
    handleNavigate(suggestion);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <FormContainer
        onSubmit={() => {}}
        methods={methods}
        className="flex items-center w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-sm z-10"
      >
        <div className="flex items-center w-full z-10">
          {/* Search Query */}
          <InputField
            name="searchQuery"
            placeholder="Search Jobs.."
            leftIcon={<FaSearch className="text-gray-400" />}
            containerClassName="flex-1 py-0"
            onChange={(e) => handleSearchChange(e)}
            inputClassName="border-none bg-transparent rounded-none text-gray-900 dark:text-gray-100 pr-3 focus:outline-none py-2"
          />

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

         {/* Analytics Button/Icon */}
      <button
        type="button"
        onClick={() => navigate(absoluteUrls.engineer.home.search_analytics)}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
        title="View Search Analytics"
      >
        <FaChartBar size={20} />
      </button>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
          {/* Location */}
          <InputField
            name="location"
            placeholder="Location"
            leftIcon={<FaMapMarkerAlt className="text-gray-400" />}
            containerClassName="flex-1 py-0 hidden lg:block"
            onChange={(e) => handleNavigate(e)}
            inputClassName="border-none bg-transparent rounded-none text-gray-900 dark:text-gray-100 pr-3 focus:outline-none"
          />
        </div>
      </FormContainer>

      {/* Autocomplete Dropdown */}
      {showDropdown && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-lg shadow-lg z-20 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

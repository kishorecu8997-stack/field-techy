import { absoluteUrls } from "@/config/urls";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
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

  return (
    <FormContainer
      onSubmit={() => {}}
      methods={methods}
      className="flex items-center w-full max-w-xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-sm z-10"
    >
      <div className="flex items-center w-full z-10">
        {/* Search Query */}
        <InputField
          name="searchQuery"
          placeholder="Search Jobs.."
          leftIcon={<FaSearch className="text-gray-400" />}
          containerClassName="flex-1 py-0"
          onChange={(e) => handleNavigate(e)}
          inputClassName="border-none bg-transparent rounded-none text-gray-900 dark:text-gray-100 pr-3 focus:outline-none py-2"
        />

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
  );
};
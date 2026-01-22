import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaSearch, FaChartBar } from "react-icons/fa"; 
import { InputField } from "./commonUI/inputs";
import { FormContainer } from "./commonUI/inputs/FormContainer";
import { absoluteUrls } from "@/config/urls";
import { Button } from "./commonUI/Buttons";
import { useNavigate } from "react-router-dom";

/**
 * JobSearchBar component provides a dual-input search form for jobs and location.
 * Features dark mode support, responsive design, and react-hook-form integration.
 * The location field is hidden on small screens and shown on large screens.
 *
 * @component
 * @example
 * <JobSearchBar />
 */
export const JobSearchBarClient = () => {
  const methods = useForm({});
  const navigate = useNavigate();

  return (
    <FormContainer
      onSubmit={() => {}}
      methods={methods}
      className="flex items-center w-full max-w-xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-sm z-0"
    >
      <div className="flex items-center w-full">
        <InputField
          name="searchQuery"
          placeholder="Search Jobs.."
          leftIcon={<FaSearch className="text-gray-400" />}
          containerClassName="flex-1 py-0"
          inputClassName="border-none bg-transparent rounded-none text-gray-900 dark:text-gray-100 pr-3 focus:outline-none py-2"
        />

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* Analytics Button/Icon */}
        <Button
          type="button"
          onClick={() => navigate(absoluteUrls.client.home.search_analytics)}
          className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
          title="View Search Analytics"
          aria-label="View Search Analytics"
        >
          <FaChartBar size={20} />
        </Button>
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
        <InputField
          name="location"
          placeholder="Location"
          leftIcon={<FaMapMarkerAlt className="text-gray-400" />}
          containerClassName="flex-1 py-0 hidden lg:block"
          inputClassName="border-none bg-transparent rounded-none text-gray-900 dark:text-gray-100 pr-3 focus:outline-none"
        />
      </div>
    </FormContainer>
  );
};

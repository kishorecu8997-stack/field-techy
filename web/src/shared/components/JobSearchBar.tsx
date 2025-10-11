import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // or use your own icon components
import { InputField } from "./commonUI/inputs";
import { useForm } from "react-hook-form";
import { FormContainer } from "./commonUI/inputs/FormContainer";

/**
 * JobSearchBar component provides a dual-input search form for jobs and location.
 * Features dark mode support, responsive design, and react-hook-form integration.
 * The location field is hidden on small screens and shown on large screens.
 * 
 * @component
 * @example
 * <JobSearchBar />
 */
export const JobSearchBar = () => {
  const methods = useForm({});
  return (
    <FormContainer
      onSubmit={() => {}}
      methods={methods}
      className="flex items-center w-full max-w-xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-sm"
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

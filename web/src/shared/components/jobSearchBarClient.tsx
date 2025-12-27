import { absoluteUrls } from "@/config/urls";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // or use your own icon components
import { useNavigate } from "react-router-dom";
import { InputField } from "./commonUI/inputs";
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
export const JobSearchBarClient = () => {
  const methods = useForm({});
  const navigate = useNavigate();

  return (
    <FormContainer
      onSubmit={() => { }}
      methods={methods}
      className="flex items-center w-full max-w-xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-sm z-0"
    >
      <div className="flex items-center w-full">
        <InputField
          name="searchQuery"
          placeholder="Search Jobs.."
          leftIcon={<FaSearch className="text-gray-400" />}
          containerClassName="flex-1 py-0"
          onChange={() => navigate(absoluteUrls.client.home.search_result)}
          inputClassName="border-none bg-transparent rounded-none text-gray-900 dark:text-gray-100 pr-3 focus:outline-none py-2"
          rules={{
            onChange: (e) => {
              const raw = e.target.value;
              const sanitized = raw.replace(/[^a-zA-Z0-9]/g, "");

              // navigate on input change
              navigate(absoluteUrls.client.home.search_result);

              return sanitized;
            }
          }}
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

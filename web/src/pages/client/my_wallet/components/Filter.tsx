import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { IoCloseSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { validateFilterDateRange } from "@/pages/engineer/user_profile/Validate";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { FilterFormData, FilterProps } from "../types";

/**
 * A component that provides a date range filter UI.
 * It allows users to select a start and end date and apply it as a filter.
 *
 * @param {FilterProps} props - The props for the component.
 * @returns {React.ReactElement | null} A React element representing the filter UI, or null if `isOpen` is false.
 */
const Filter: React.FC<FilterProps> = ({ isOpen, onClose, onFilter }) => {
  if (!isOpen) return null;

  const methods = useForm<FilterFormData>({
    defaultValues: {
      startDate: null,
      endDate: null,
    },
  });

  const handleFilter = (data: FilterFormData) => {
    onFilter?.(data);
    onClose();
  };

  return (
    <div className="inset-0 z-50 items-center justify-center p-4 w-full">
      <div className="bg-white dark:bg-gray-900 p-6 relative w-full">
        <IoCloseSharp
          onClick={onClose}
          className="h-6 w-6 cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Filters
        </h2>

        <FormContainer methods={methods} onSubmit={handleFilter}>
          {/* Date Fields Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
            {/* Start Date */}
            <div className="flex-1">
              <DatePickerInput
                name="startDate"
                label="Start Date"
                required
                minDate={new Date(1970, 0, 1)}
                // maxDate={new Date(2030, 11, 31)}
                rules={{
                  validate: (value) =>
                    validateFilterDateRange(
                      methods.getValues("startDate"),
                      value,
                    ),
                }}
              />
            </div>

            {/* End Date */}
            <div className="flex-1">
              <DatePickerInput
                name="endDate"
                label="End Date"
                required
                minDate={new Date(1970, 0, 1)}
                // maxDate={new Date(2030, 11, 31)}
                rules={{
                  validate: (value) =>
                    validateFilterDateRange(
                      methods.getValues("startDate"),
                      value,
                    ),
                }}
              />
            </div>
          </div>

          {/* Apply Filter Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-lg font-medium rounded-lg"
          >
            Apply filter
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default Filter;

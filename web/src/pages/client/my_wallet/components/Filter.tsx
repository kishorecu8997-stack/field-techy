// import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
// import { IoCloseSharp } from "react-icons/io5";
// import { useForm, Controller } from "react-hook-form";
// import { validateDateRange } from "@/pages/engineer/user_profile/Validate";
// import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
// import { Button } from "@/shared/components/commonUI/Buttons";

// interface FilterFormData {
//   startDate: Date | null;
//   endDate: Date | null;
// }

// interface FilterProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onFilter?: (data: FilterFormData) => void;
// }


// const Filter: React.FC<FilterProps> = ({ isOpen, onClose, onFilter }) => {
//   if (!isOpen) return null;

//   const methods = useForm<FilterFormData>({
//     defaultValues: {
//       startDate: null,
//       endDate: null,
//     },
//   });

//   const handleFilter = (data: FilterFormData) => {
//     onFilter?.(data);
//     onClose();
//   };

//   return (
//     <div className="inset-0 z-50 items-center justify-center p-4">
//       <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl transform transition-all">
//         {/* Modal Content */}
//         <div className="bg-white dark:bg-gray-900 p-6 relative">
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//           >
//             <IoCloseSharp className="h-6 w-6 cursor-pointer" />
//           </button>
//           {/* Title */}
//           <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
//             Filters
//           </h2>          

//           <FormContainer methods={methods} onSubmit={handleFilter}>
//             {/* Filter Options */}
//             <div className="flex-1 overflow-y-auto px-3 space-y-3">
//               <Controller
//                 name="startDate"
//                 control={methods.control}
//                 rules={{
//                   validate: (value) =>
//                     validateDateRange(value, methods.getValues("endDate")),
//                 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <>
//                     <DatePickerInput
//                       label="Start Date"
//                       isShowLabel={false}
//                       placeholder="Start date"
//                       value={field.value}
//                       onChange={field.onChange}
//                       minDate={new Date(1970, 0, 1)}
//                       maxDate={new Date()}
//                     />
//                     {error && <p className="text-red-600 text-sm">{error.message}</p>}
//                   </>
//                 )}
//               />
//               <Controller
//                 name="endDate"
//                 control={methods.control}
//                 rules={{
//                   required: "End date is required",
//                   validate: (value) => {
//                     const startDate = methods.getValues("startDate");
//                     if (startDate && value && value < startDate) {
//                       return "End date must be after start date";
//                     }
//                     return true;
//                   },
//                 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <>
//                     <DatePickerInput
//                       label="End Date"
//                       isShowLabel={false}
//                       placeholder="End date"
//                       value={field.value}
//                       onChange={(date) => {
//                         field.onChange(date);
//                         methods.trigger("startDate"); // Re-validate start date
//                       }}
//                       minDate={methods.getValues("startDate") || new Date(1970, 0, 1)}
//                     />
//                     {error && <p className="text-red-600 text-sm">{error.message}</p>}
//                   </>
//                 )}
//               />
//             </div>
//             <div className="mt-6 flex justify-end space-x-3">
//               <Button type="submit" variant="primary">               
//                 Apply Filters
//               </Button>
//             </div>
//           </FormContainer>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Filter;


import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { IoCloseSharp } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { validateDateRange } from "@/pages/engineer/user_profile/Validate";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { Button } from "@/shared/components/commonUI/Buttons";

interface FilterFormData {
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter?: (data: FilterFormData) => void;
}

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
        {/* Modal Content */}
        <div className="bg-white dark:bg-gray-900 p-6 relative w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <IoCloseSharp className="h-6 w-6 cursor-pointer" />
          </button>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Filters
          </h2>

          <FormContainer methods={methods} onSubmit={handleFilter}>
            {/* Date Fields Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
              {/* Start Date */}
              <div className="flex-1">
                <Controller
                  name="startDate"
                  control={methods.control}
                  rules={{
                    validate: (value) =>
                      validateDateRange(value, methods.getValues("endDate")),
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <DatePickerInput
                        label=""
                        isShowLabel={false}
                        placeholder="DD/MM/YYYY"
                        value={field.value}
                        onChange={field.onChange}
                        minDate={new Date(1970, 0, 1)}
                        maxDate={new Date()}
                        className="w-full"
                      />
                      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
                    </div>
                  )}
                />
              </div>

              {/* End Date */}
              <div className="flex-1">
                <Controller
                  name="endDate"
                  control={methods.control}
                  rules={{
                    required: "End date is required",
                    validate: (value) => {
                      const startDate = methods.getValues("startDate");
                      if (startDate && value && value < startDate) {
                        return "End date must be after start date";
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <DatePickerInput
                        label=""
                        isShowLabel={false}
                        placeholder="DD/MM/YYYY"
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          methods.trigger("startDate"); // Re-validate start date
                        }}
                        minDate={methods.getValues("startDate") || new Date(1970, 0, 1)}
                        className="w-full"
                      />
                      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
                    </div>
                  )}
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
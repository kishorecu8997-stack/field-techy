import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { GoDownload } from "react-icons/go";
import { IoCloseSharp } from "react-icons/io5";
import type { DownloadInvoiceModalProps } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";

const dateRanges = [
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last Year",
  "Custom Date Range",
];
const radioOptions = dateRanges.map((range) => ({
  label: range,
  value: range,
}));
interface IFormInputs {
  dateRange: string;
  startDate?: string;
  endDate?: string;
}
const DownloadInvoice: React.FC<DownloadInvoiceModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const methods = useForm<IFormInputs>({
    defaultValues: {
      dateRange: dateRanges[0],
    },
  });
  const { watch, handleSubmit } = methods;
  const selectedRange = watch("dateRange");
  if (!isOpen) return null;
  const onSubmit = () => {
    onDownload();
  };

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl transform transition-all bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 relative">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <IoCloseSharp className="h-6 w-6 cursor-pointer" />
            </button>

            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
              Download Account Statement
            </h2>

            <RadioField
              name="dateRange"
              options={radioOptions}
              direction="vertical"
              isShowLabel={false}
            />

            {selectedRange === "Custom Date Range" && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <InputField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  rules={{ required: "Start date is required" }}
                />
                <InputField
                  name="endDate"
                  label="End Date"
                  type="date"
                  rules={{ required: "End date is required" }}
                />
              </div>
            )}

            <p className="text-center text-gray-600 dark:text-gray-300 my-6">
              Do You Want to Download Invoice as PDF Document?
            </p>

            <Button
              type="submit"
              leftIcon={<GoDownload className="h-6 w-6" />}
              className="cursor-pointer w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Download</span>
            </Button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default DownloadInvoice;

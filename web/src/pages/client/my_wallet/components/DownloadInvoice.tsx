import React, { useState } from 'react';
import { GoDownload } from "react-icons/go";
import { IoCloseSharp } from 'react-icons/io5';
import type { DownloadInvoiceModalProps } from '../types';
import { Button } from '@/shared/components/commonUI/Buttons';

const dateRanges = [
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last Year",
  "Custom Date Range",
];

const DownloadInvoice: React.FC<DownloadInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onDownload 
}) => {
  const [selectedRange, setSelectedRange] = useState<string>(dateRanges[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl transform transition-all bg-white dark:bg-gray-900">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <IoCloseSharp className="h-6 w-6 cursor-pointer" />
          </button>

          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Download Account Statement
          </h2>

          <div className="space-y-4">
            {dateRanges.map((range) => (
              <div key={range} className="flex items-center">
                <input
                  type="radio"
                  id={range}
                  name="dateRange"
                  value={range}
                  checked={selectedRange === range}
                  onChange={() => setSelectedRange(range)}
                  className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor={range} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {range}
                </label>
              </div>
            ))}
          </div>

          {selectedRange === "Custom Date Range" && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </div>
          )}
          
          <p className="text-center text-gray-600 dark:text-gray-300 my-6">
            Do You Want to Download Invoice as PDF Document?
          </p>

          <Button
            onClick={onDownload}
            leftIcon={<GoDownload className="h-6 w-6" />}
            className="cursor-pointer w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadInvoice;